class CalibrationManager {
    constructor(app) {
        this.app = app;
        this.isCalibrating = false;
        this.calibPollInterval = null;
        this.calibStatusFile = null;
    }
    async checkCalibration() {
        const content = await Executor.exec(`cat ${this.app.paths.configFile} 2>/dev/null || echo ""`);
        const isCalibrated = ["DEVICE_VOLUMEUP", "DEVICE_VOLUMEDOWN", "DEVICE_POWER"].every(key => {
            const match = content.match(new RegExp(`${key}=(.+)`, 'm'));
            return match && match[1] && match[1].trim().length > 0;
        });
        await this.app.uiManager.updateCalibrationUI(isCalibrated);
        return isCalibrated;
    }
    async startCalibration() {
        if (this.isCalibrating) return;
        this.isCalibrating = true;
        this.calibStatusFile = `/data/adb/modules/tri_exp_caelifall/webroot/key/cmd/calib_status_${Date.now()}.txt`;
        Logger.log('开始按键校准...', 'success', true);
        this.app.uiManager.openModal(document.getElementById('calibration-modal'));
        try {
            await Executor.exec(`${this.app.paths.portalScript} calibrate ${this.calibStatusFile}`);
            this.calibPollInterval = setInterval(() => this.pollCalibrationStatus(), 500);
        } catch (e) {
            Logger.log(`无法启动校准: ${e.message}`, 'err', true);
            this.cancelCalibration();
        }
    }
    async pollCalibrationStatus() {
        try {
            const status = await Executor.exec(`cat ${this.calibStatusFile} 2>/dev/null || echo "WAITING"`);
            const updateStep = (id, status, text) => {
                const el = document.getElementById(id);
                const badge = el?.querySelector('.status-badge');
                if (el && badge) { el.setAttribute('data-status', status); badge.textContent = text; }
            };
            const updateProgress = (current) => {
                const prog = document.getElementById('calib-progress');
                const curr = document.getElementById('calib-current');
                if (curr) curr.textContent = current;
                if (prog) prog.style.width = `${(current / 3) * 100}%`;
            };
            const statusMap = {
                'WAITING_VUP': () => { document.getElementById('calib-instruction').textContent = '请按下【音量上键】'; updateStep('calib-vup', 'waiting', '等待中...'); updateProgress(0); },
                'DETECTED_VUP': () => { updateStep('calib-vup', 'success', '已校准 ✓'); updateProgress(1); },
                'WAITING_VDOWN': () => { document.getElementById('calib-instruction').textContent = '请按下【音量下键】'; updateStep('calib-vdown', 'waiting', '等待中...'); updateProgress(1); },
                'DETECTED_VDOWN': () => { updateStep('calib-vdown', 'success', '已校准 ✓'); updateProgress(2); },
                'WAITING_POWER': () => { document.getElementById('calib-instruction').textContent = '请按下【电源键】'; updateStep('calib-power', 'waiting', '等待中...'); updateProgress(2); },
                'DETECTED_POWER': () => { updateStep('calib-power', 'success', '已校准 ✓'); updateProgress(3); },
                'DONE_SUCCESS': async () => { document.getElementById('calib-instruction').textContent = '🎉 校准成功！'; updateProgress(3); Logger.log('按键校准成功', 'success', true); await Utils.sleep(1500); this.cancelCalibration(true); await this.app.loadState(); },
                'DONE_FAIL': async () => { document.getElementById('calib-instruction').textContent = '❌ 校准失败，请重试'; Logger.log('按键校准失败', 'err', true); await Utils.sleep(2000); this.cancelCalibration(true); }
            };
            if (statusMap[status]) await statusMap[status]();
        } catch (e) {
            if (this.isCalibrating) { Logger.log('校准流程意外终止', 'warn'); this.cancelCalibration(); }
        }
    }
    async cancelCalibration(isSilent = false) {
        if (!this.isCalibrating) return;
        clearInterval(this.calibPollInterval);
        this.calibPollInterval = null;
        try { await Executor.exec(`pkill -f "portal calibrate"; rm -f ${this.calibStatusFile}`); } catch (e) {}
        this.isCalibrating = false;
        this.app.uiManager.closeModal(document.getElementById('calibration-modal'));
        if (!isSilent) { Logger.log('校准已取消', 'warn'); Utils.showToast('校准已取消'); }
    }
}
window.CalibrationManager = CalibrationManager;
