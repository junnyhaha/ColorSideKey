class KeyExtenderUI {
    constructor() {
        this.busy = false;
        this.isUnlocked = false;
        this.pendingChanges = {};
        this.previousSelectValues = {};
        this.hasAnimatedInitial = false;
        this.animationCompleted = false;
        this.freeFeatures = ["vx付款码", "zfb付款码", "手电筒", "蓝牙", "一键录音", "一键闪记", "静响切换", "小布随口记", "小布识屏", "截屏"];
        this.paths = {
            base: "/data/adb/modules/tri_exp_caelifall",
            moduleProp: "/data/adb/modules/tri_exp_caelifall/module.prop",
            cmdDir: "/data/adb/modules/tri_exp_caelifall/webroot/key/cmd",
            configFile: "/data/adb/modules/tri_exp_caelifall/webroot/key/cmd/config.conf",
            shellTxt: "/data/adb/modules/tri_exp_caelifall/webroot/key/cmd/shell.txt",
            portalScript: "/data/adb/modules/tri_exp_caelifall/webroot/bin/bypass",
            sentinelScript: "/data/adb/modules/tri_exp_caelifall/webroot/bin/bypass"
        };
        this.features = "vx付款码|#vx付款码|#vx付款码\nzfb付款码|#zfb付款码|#zfb付款码\n手电筒|#手电筒|关手电筒\n蓝牙|#蓝牙|#关蓝牙\n一键录音|#录音|#关录音\n一键闪记|#一键闪记|#一键闪记\n静响切换|#静响切换|#静响切换\n小布随口记|#小布随口记|#关小布随口记\n小布识屏|#小布识屏|#小布识屏\n截屏|#截屏|#截屏\nvx扫码|#vx扫码|#vx扫码\nzfb扫码|#zfb扫码|#zfb扫码\nNFC|#nfc|#关nfc\n一键录屏|#录屏|#录屏\n一键录像|#录像|#关录像\nclash控制|#clash|#关clash"
            .split('\n').map(line => {
                const [name, on, off] = line.split('|');
                return { name, on, off };
            });
        this.keyMap = {
            up: { path: `${this.paths.base}/webroot/key/sdk/up.sh`, rePath: `${this.paths.base}/webroot/key/sdk/reup.sh` },
            down: { path: `${this.paths.base}/webroot/key/sdk/down.sh`, rePath: `${this.paths.base}/webroot/key/sdk/redown.sh` },
            dc: { path: `${this.paths.base}/webroot/key/cbk/dc.sh`, rePath: `${this.paths.base}/webroot/key/cbk/redc.sh` },
            lp: { path: `${this.paths.base}/webroot/key/cbk/lp.sh`, rePath: `${this.paths.base}/webroot/key/cbk/relp.sh` },
            vup_dc: { path: `${this.paths.base}/webroot/key/vuk/dc.sh`, rePath: `${this.paths.base}/webroot/key/vuk/redc.sh` },
            vup_lp: { path: `${this.paths.base}/webroot/key/vuk/lp.sh`, rePath: `${this.paths.base}/webroot/key/vuk/relp.sh` },
            vdown_dc: { path: `${this.paths.base}/webroot/key/vdk/dc.sh`, rePath: `${this.paths.base}/webroot/key/vdk/redc.sh` },
            vdown_lp: { path: `${this.paths.base}/webroot/key/vdk/lp.sh`, rePath: `${this.paths.base}/webroot/key/vdk/relp.sh` },
            power_dc: { path: `${this.paths.base}/webroot/key/dyk/dc.sh`, rePath: `${this.paths.base}/webroot/key/dyk/redc.sh` },
            power_lp: { path: `${this.paths.base}/webroot/key/dyk/lp.sh`, rePath: `${this.paths.base}/webroot/key/dyk/relp.sh` },
        };
        this.mounts = {
            sdk: `/storage/emulated/0/Android/custom/三段式/上拨.rc     ${this.paths.base}/webroot/key/sdk/up.sh
/storage/emulated/0/Android/custom/三段式/上拨复位.rc ${this.paths.base}/webroot/key/sdk/reup.sh
/storage/emulated/0/Android/custom/三段式/下拨.rc     ${this.paths.base}/webroot/key/sdk/down.sh
/storage/emulated/0/Android/custom/三段式/下拨复位.rc ${this.paths.base}/webroot/key/sdk/redown.sh`,
            cbk: `/storage/emulated/0/Android/custom/侧边键/双击.rc ${this.paths.base}/webroot/key/cbk/dc.sh
/storage/emulated/0/Android/custom/侧边键/双击复位.rc ${this.paths.base}/webroot/key/cbk/redc.sh
/storage/emulated/0/Android/custom/侧边键/长按.rc ${this.paths.base}/webroot/key/cbk/lp.sh
/storage/emulated/0/Android/custom/侧边键/长按复位.rc ${this.paths.base}/webroot/key/cbk/relp.sh`,
            vuk: `/storage/emulated/0/Android/custom/音量上/双击.rc ${this.paths.base}/webroot/key/vuk/dc.sh
/storage/emulated/0/Android/custom/音量上/双击复位.rc ${this.paths.base}/webroot/key/vuk/redc.sh
/storage/emulated/0/Android/custom/音量上/长按.rc ${this.paths.base}/webroot/key/vuk/lp.sh
/storage/emulated/0/Android/custom/音量上/长按复位.rc ${this.paths.base}/webroot/key/vuk/relp.sh`,
            vdk: `/storage/emulated/0/Android/custom/音量下/双击.rc ${this.paths.base}/webroot/key/vdk/dc.sh
/storage/emulated/0/Android/custom/音量下/双击复位.rc ${this.paths.base}/webroot/key/vdk/redc.sh
/storage/emulated/0/Android/custom/音量下/长按.rc ${this.paths.base}/webroot/key/vdk/lp.sh
/storage/emulated/0/Android/custom/音量下/长按复位.rc ${this.paths.base}/webroot/key/vdk/relp.sh`,
            dyk: `/storage/emulated/0/Android/custom/电源键/双击.rc ${this.paths.base}/webroot/key/dyk/dc.sh
/storage/emulated/0/Android/custom/电源键/双击复位.rc ${this.paths.base}/webroot/key/dyk/redc.sh
/storage/emulated/0/Android/custom/电源键/长按.rc ${this.paths.base}/webroot/key/dyk/lp.sh
/storage/emulated/0/Android/custom/电源键/长按复位.rc ${this.paths.base}/webroot/key/dyk/relp.sh`
        };
        this.uiManager = new UIManager(this);
        this.calibrationManager = new CalibrationManager(this);
        this.editorManager = new EditorManager(this);
        this.setupErrorHandlers();
        this.safeInit();
    }
    setupErrorHandlers() {
        window.addEventListener('error', (event) => {
            console.error('全局错误:', event.error);
        });
        window.addEventListener('unhandledrejection', (event) => {
            console.error('未处理的Promise拒绝:', event.reason);
        });
    }
    safeInit() {
        const init = () => {
            try {
                this.init();
            } catch (error) {
                console.error('初始化过程中发生错误:', error);
                Utils.showToast('初始化失败，请检查控制台');
            }
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            requestAnimationFrame(init);
        }
    }
    async init() {
        try {
            this.bindEvents();
            
            this.checkUnlockStatus().catch(() => { this.isUnlocked = false; }).then(async () => {
                this.uiManager.updatePremiumUI(this.isUnlocked);
                this.uiManager.populateFeatureGrids(this.features, this.isUnlocked, this.freeFeatures);
                
                await new Promise(resolve => setTimeout(resolve, 50));
                
                await this.checkHardwareSupport();
                
                requestAnimationFrame(() => {
                    const activeTabContent = document.querySelector('.tab-content.active');
                    if (activeTabContent && !this.hasAnimatedInitial) {
                        this.replayCardAnimations(activeTabContent);
                        this.hasAnimatedInitial = true;
                    }
                });
                
                await this.loadState();
                await this.updateSwitchStatesAndAutoStart(true);
            });
            
            this.initializeEnvironment();
        } catch (e) {
            Utils.showToast('初始化失败，请检查权限设置');
        }
    }
    async initializeEnvironment() {
        const dirs = [this.paths.cmdDir, `${this.paths.base}/webroot/key/tmp`, '/data/cache/key'];
        Object.values(this.keyMap).forEach(v => {
            dirs.push(v.path.substring(0, v.path.lastIndexOf('/')));
        });
        await Executor.exec(`mkdir -p ${[...new Set(dirs)].join(' ')}`);
        await Executor.exec(`touch ${this.paths.configFile}`);
    }
    async checkUnlockStatus() {
        try {
            const portalBin = `${this.paths.base}/webroot/bin/bypass`;
            const result = await Executor.exec(`[ -f "${portalBin}" ] && "${portalBin}" check_unlock || echo "LOCKED"`);
            this.isUnlocked = (result.trim() === 'UNLOCKED');
        } catch (e) {
            this.isUnlocked = false;
        }
    }
    async verifyPremiumStatus() {
        try {
            const portalBin = `${this.paths.base}/webroot/bin/bypass`;
            const result = await Executor.exec(`[ -f "${portalBin}" ] && "${portalBin}" check_unlock || echo "LOCKED"`);
            return result.trim() === 'UNLOCKED';
        } catch (e) {
            return false;
        }
    }
    openLink(url) {
        Executor.exec(`am start -a android.intent.action.VIEW -d "${url}"`).catch(() => {});
    }
    cancelVerification() {
        const verifyButton = document.getElementById('group-verify-btn');
        if (verifyButton) {
            verifyButton.textContent = '群验证';
            verifyButton.disabled = false;
        }
        this.uiManager.hidePremiumModal();
    }
    async startGroupVerification() {
        const verifyButton = document.getElementById('group-verify-btn');
        if (!verifyButton) return;
        verifyButton.textContent = '正在验证中...';
        verifyButton.disabled = true;
        setTimeout(() => this.performGroupVerification(verifyButton), 100);
    }
    async performGroupVerification(verifyButton) {
        verifyButton.textContent = '验证中...';
        const resetVerifyButton = () => {
            Utils.showToast('验证失败：请赞助后联系作者进入赞助群');
            verifyButton.textContent = '群验证';
            verifyButton.disabled = false;
        };
        try {
            const portalBin = `${this.paths.base}/webroot/bin/bypass`;
            const result = await Executor.exec(`[ -f "${portalBin}" ] && "${portalBin}" verify_group || echo "VERIFY_FAIL:NO_VERIFIER"`);
            const lines = result ? result.trim().split('\n') : [];
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed === 'VERIFY_SUCCESS') {
                    verifyButton.textContent = '验证成功';
                    verifyButton.disabled = true;
                    this.uiManager.hidePremiumModal();
                    await Utils.sleep(100);
                    await this.checkUnlockStatus();
                    this.uiManager.updatePremiumUI(this.isUnlocked);
                    this.uiManager.populateFeatureGrids(this.features, this.isUnlocked, this.freeFeatures);
                    await this.loadState();
                // 重新触发功能卡片动画以恢复可见性（避免卡片在重建后保持 opacity:0）
                const activeTabContent = document.querySelector('.tab-content.active');
                if (activeTabContent) {
                    requestAnimationFrame(() => {
                        this.replayCardAnimations(activeTabContent);
                    });
                }
                    this.showCongratulationsModal();
                    return;
                }
                if (trimmed.startsWith('VERIFY_FAIL:')) {
                    resetVerifyButton();
                    return;
                }
            }
            resetVerifyButton();
        } catch (e) {
            resetVerifyButton();
        }
    }
    showCongratulationsModal() {
        const modal = document.getElementById('congratulations-modal');
        if (modal) {
            this.uiManager.openModal(modal);
            const overlay = modal.querySelector('.congratulations-overlay');
            if (overlay) overlay.onclick = () => this.closeCongratulationsModal();
        }
    }
    closeCongratulationsModal() {
        const modal = document.getElementById('congratulations-modal');
        if (modal) {
            this.uiManager.closeModal(modal);
            const overlay = modal.querySelector('.congratulations-overlay');
            if (overlay) overlay.onclick = null;
            document.body.classList.remove('modal-open');
        }
    }
    async checkHardwareSupport() {
        const manageUI = async (cardId, customType, isSupported, noHardwareMessage) => {
            const customSwitch = document.querySelector(`.custom-toggle[data-type="${customType}"]`);
            if (!isSupported) {
                const card = document.getElementById(cardId);
                if (card) card.querySelector('.card-body').innerHTML = `<div class="unsupported-notice">${noHardwareMessage}</div>`;
                if (customSwitch) {
                    customSwitch.disabled = true;
                    customSwitch.dataset.unsupported = 'true';
                }
            }
            return isSupported;
        };
        
        const hasTristateKey = await manageUI('tristate-card', 'sdk', 
            await Executor.exec(`[ -f "/proc/tristatekey/tri_state" ] && echo "1" || echo "0"`) === '1',
            '你的手机没有三段键');
        const hasSingleKey = await manageUI('single-key-card', 'cbk', 
            await Executor.exec(`getevent -lp 2>/dev/null | grep -q "BTN_TRIGGER_HAPPY32" && echo "1" || echo "0"`) === '1',
            '你的手机没有快捷键');
        
        if (!this.hasAnimatedInitial) {
            let targetTab = null;
            
            if (hasTristateKey) {
                targetTab = 'tristate';
            } else if (hasSingleKey) {
                targetTab = 'single-key';
            }
            
            if (targetTab) {
                const currentActiveTab = document.querySelector('.tab-item.active');
                const currentActiveTabData = currentActiveTab?.dataset.tab;
                
                if (currentActiveTabData !== targetTab) {
                    const targetButton = document.querySelector(`.tab-item[data-tab="${targetTab}"]`);
                    const targetContent = document.getElementById(`tab-${targetTab}`);
                    
                    if (targetButton && targetContent) {
                        document.querySelectorAll('.tab-item').forEach(btn => btn.classList.remove('active'));
                        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                        
                        targetButton.classList.add('active');
                        targetContent.classList.add('active');
                    }
                }
            }
        }
    }
    bindEvents() {
        this.bindTabSwitching();
        
        const shieldToggle = document.getElementById('shield-toggle');
        if (shieldToggle) shieldToggle.onchange = (e) => this.handleGenericChange('shielded', e.target.checked ? '0' : '1');
        
        document.addEventListener('click', async (e) => {
            const card = e.target.closest('.feature-card');
            if (!card) return;
            
            const key = card.dataset.key;
            const feature = card.dataset.feature;
            
            if (feature === 'coming-soon') {
                this.uiManager.showComingSoonModal();
                return;
            }
            
            if (card.dataset.locked === 'true') {
                const isVerified = await this.verifyPremiumStatus();
                if (!isVerified) {
                    this.uiManager.showPremiumModal();
                    return;
                }
            }
            
            if (!key) return;
            
            const grid = card.closest('.feature-grid');
            if (grid) {
                grid.querySelectorAll('.feature-card').forEach(c => {
                    c.classList.remove('active', 'just-selected');
                    c.style.animationDelay = '0s';
                });
            }
            
            card.classList.add('active', 'just-selected');
            setTimeout(() => card.classList.remove('just-selected'), 300);
            
            if (feature === 'custom') {
                const customType = card.dataset.customType;
                if (customType) {
                    await this.handleCustomModeForKey(key, customType, true);
                }
            } else {
                const customType = this.getCustomTypeFromKey(key);
                if (customType) {
                    const currentValue = await this.getKeyBindingValue(key);
                    if (currentValue === '2') {
                        await this.handleCustomModeForKey(key, customType, false);
                    }
                }
                await this.handleGenericChange(key, feature);
            }
        });
        
        this.bindButtonEvents();
        this.bindEditorEvents();
        this.bindModalEvents();
    }
    bindTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab-item');
        const tabContents = document.querySelectorAll('.tab-content');
        let switchTimeout = null;
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                const targetContent = document.getElementById(`tab-${targetTab}`);
                
                const currentActive = document.querySelector('.tab-content.active');
                
                if (currentActive && currentActive.id === `tab-${targetTab}`) {
                    return;
                }
                
                if (switchTimeout) {
                    clearTimeout(switchTimeout);
                    switchTimeout = null;
                }
                
                tabContents.forEach(content => {
                    content.classList.remove('hiding', 'active');
                });
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                if (currentActive) {
                    currentActive.classList.add('hiding');
                    
                    switchTimeout = setTimeout(() => {
                        currentActive.classList.remove('hiding');
                        if (targetContent) {
                            targetContent.classList.add('active');
                            requestAnimationFrame(() => {
                                this.replayCardAnimations(targetContent);
                            });
                        }
                        switchTimeout = null;
                    }, 350);
                } else {
                    if (targetContent) {
                        targetContent.classList.add('active');
                        requestAnimationFrame(() => {
                            this.replayCardAnimations(targetContent);
                        });
                    }
                }
            });
        });
        
        this.bindAboutSectionCards();
    }
    bindAboutSectionCards() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.link-item') || e.target.closest('.contact-item')) {
                return;
            }
            
            const header = e.target.closest('.about-section-header');
            if (!header) return;
            
            const card = header.closest('.about-section-card');
            if (!card) return;
            
            card.classList.toggle('expanded');
        });
    }
    replayCardAnimations(tabContent) {
        const items = tabContent.children;
        if (!items || items.length === 0) return;
        
        const allFeatureCards = tabContent.querySelectorAll('.feature-card.active');
        allFeatureCards.forEach(card => {
            card.classList.add('defer-active');
        });
        
        Array.from(items).forEach(item => {
            item.classList.remove('slide-in-item');
            item.style.animationDelay = '';
            const featureCards = item.querySelectorAll('.feature-card');
            featureCards.forEach(card => {
                card.classList.remove('slide-in');
                card.style.animationDelay = '';
            });
        });
        
        setTimeout(() => {
            let maxDelay = 0;
            Array.from(items).forEach((item, index) => {
                const delay = 0.01 + (index * 0.06);
                item.style.animationDelay = `${delay}s`;
                item.classList.add('slide-in-item');
                
                const featureCards = item.querySelectorAll('.feature-card');
                if (featureCards.length > 0) {
                    featureCards.forEach((card, cardIndex) => {
                        const cardDelay = delay + 0.08 + (cardIndex * 0.015);
                        card.style.animationDelay = `${cardDelay}s`;
                        card.classList.add('slide-in');
                        if (cardDelay > maxDelay) {
                            maxDelay = cardDelay;
                        }
                    });
                }
            });
            
            const totalAnimationTime = (maxDelay + 0.7) * 1000;
            setTimeout(() => {
                const allActiveCards = tabContent.querySelectorAll('.feature-card.active.defer-active');
                allActiveCards.forEach(card => {
                    card.classList.remove('defer-active');
                });
                this.animationCompleted = true;
            }, totalAnimationTime);
        }, 10);
    }
    bindButtonEvents() {
        document.querySelectorAll('.start-calib-btn, .recalib-btn').forEach(btn => {
            btn.onclick = () => this.calibrationManager.startCalibration();
        });
        
        const cancelBtn = document.getElementById('calib-cancel-btn');
        if (cancelBtn) cancelBtn.onclick = () => this.calibrationManager.cancelCalibration();
    }
    bindEditorEvents() {
        document.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.btn-edit');
            if (editBtn) {
                e.stopPropagation();
                this.editorManager.openEditor(editBtn.dataset.type, editBtn.dataset.key);
            }
        });
        
        const editorCloseBtn = document.getElementById('editor-close-btn');
        if (editorCloseBtn) editorCloseBtn.onclick = () => this.editorManager.closeEditor();
        const editorSaveBtn = document.getElementById('editor-save-btn');
        if (editorSaveBtn) editorSaveBtn.onclick = () => this.editorManager.saveFile();
        const editorTextarea = document.getElementById('editor-textarea');
        if (editorTextarea) editorTextarea.addEventListener('input', () => this.editorManager.updateLineNumbers());
        const editorContainer = document.getElementById('editor-container');
        if (editorContainer) {
            editorContainer.addEventListener('touchstart', (e) => this.editorManager.handleEditorTouchStart(e), { passive: false });
            editorContainer.addEventListener('touchmove', (e) => this.editorManager.handleEditorTouchMove(e), { passive: false });
            editorContainer.addEventListener('touchend', (e) => this.editorManager.handleEditorTouchEnd(e));
        }
    }
    bindModalEvents() {
        const showSponsorCodeBtn = document.getElementById('show-sponsor-code-btn');
        if (showSponsorCodeBtn) showSponsorCodeBtn.onclick = () => this.uiManager.showImageModal();
        const groupVerifyBtn = document.getElementById('group-verify-btn');
        if (groupVerifyBtn) groupVerifyBtn.onclick = () => this.startGroupVerification();
        const imageModalClose = document.getElementById('image-modal-close');
        if (imageModalClose) imageModalClose.onclick = () => this.uiManager.hideImageModal();
        const comingSoonCloseBtn = document.getElementById('coming-soon-close-btn');
        if (comingSoonCloseBtn) comingSoonCloseBtn.onclick = () => this.uiManager.hideComingSoonModal();
        
        const imageModal = document.getElementById('image-modal');
        if (imageModal) {
            imageModal.onclick = (e) => {
                if (e.target === imageModal) {
                    this.uiManager.hideImageModal();
                }
            };
        }
    }
    async handleGenericChange(key, value) {
        this.pendingChanges[key] = value;
        await this.autoApplyChanges();
    }
    async autoApplyChanges() {
        if (this.busy || Object.keys(this.pendingChanges).length === 0) return;
        this.busy = true;
        try {
            for (const key in this.pendingChanges) {
                const value = this.pendingChanges[key];
                if (key === 'shielded') {
                    await Executor.exec(`chmod ${value === '0' ? '0200' : '0644'} /proc/tristatekey/tri_state 2>/dev/null`);
                    await Executor.setKv(this.paths.configFile, 'BIND_shielded', value);
                } else if (key.startsWith('custom_')) {
                    continue;
                } else if (this.keyMap[key]) {
                    await this.applySelectChange(key, value);
                }
            }
            await this.updateSwitchStatesAndAutoStart(false);
            Logger.log('✓ 配置已保存并自动生效', 'success', true);
        } catch (e) {
            Logger.log(`✗ 应用失败: ${e.message}`, 'err', true);
        } finally {
            this.busy = false;
            this.pendingChanges = {};
            await this.loadState();
        }
    }
    getCustomTypeFromKey(key) {
        if (['up', 'down'].includes(key)) return 'sdk';
        if (['dc', 'lp'].includes(key)) return 'cbk';
        if (['vup_dc', 'vup_lp'].includes(key)) return 'vuk';
        if (['vdown_dc', 'vdown_lp'].includes(key)) return 'vdk';
        if (['power_dc', 'power_lp'].includes(key)) return 'dyk';
        return null;
    }
    async getKeyBindingValue(key) {
        const rawStates = Utils.parseKvData(await Executor.exec(`cat ${this.paths.configFile} 2>/dev/null || echo ""`));
        return rawStates[`BIND_${key}`] || '0';
    }
    async handleCustomModeForKey(key, customType, enable) {
        this.pendingChanges[`custom_${customType}_${key}`] = enable;
        this.pendingChanges[key] = enable ? '2' : '0';
        
        await Executor.setKv(this.paths.configFile, `BIND_${key}`, enable ? '2' : '0');
        
        if (enable) {
            await this.toggleCustomModeForKey(customType, key, true, true);
        } else {
            await this.toggleCustomModeForKey(customType, key, false, true);
        }
        
        await Utils.sleep(100);
        
        const grid = document.getElementById(`${key}-grid`);
        const keySection = grid?.closest('.key-section');
        const editBtn = keySection?.querySelector('.btn-edit');
        if (editBtn) {
            editBtn.style.display = enable ? 'inline-block' : 'none';
        }
        
        await this.updateSwitchStatesAndAutoStart(false);
        Utils.showToast(enable ? '自定义模式已启用，可点击编辑按钮' : '自定义模式已关闭');
    }
    async applySelectChange(key, featureName) {
        const { path, rePath } = this.keyMap[key];
        await Executor.exec(`umount ${path} 2>/dev/null; umount ${rePath} 2>/dev/null; rm -f ${path} ${rePath}`);
        if (featureName !== '0') {
            await this.ensureShellTxt();
            const feature = this.features.find(f => f.name === featureName);
            if (feature) {
                const createScript = async (scriptPath, pattern) => {
                    const line = await Executor.exec(`grep -A1 "${pattern}" "${this.paths.shellTxt}" | tail -n1`);
                    const content = Utils.unicodeBtoa(`#!/system/bin/sh\n${line}`);
                    await Executor.exec(`echo '${content}' | base64 -d > ${scriptPath}; chmod 755 ${scriptPath}`);
                };
                await createScript(path, feature.on);
                const noResetKeys = ['up', 'down'];
                const noResetFeatures = ["vx付款码", "vx扫码", "zfb付款码", "zfb扫码", "一键闪记", "静响切换", "小布识屏", "截屏"];
                if (!(noResetKeys.includes(key) && noResetFeatures.includes(featureName))) {
                    await createScript(rePath, feature.off);
                }
            }
        }
        await Executor.setKv(this.paths.configFile, `BIND_${key}`, featureName);
    }
    async toggleCustomModeForKey(type, key, enable, isSilent = false) {
        if (!isSilent) Logger.log(`${enable ? '启用' : '关闭'} [${key}] 自定义模式`, 'success', true);
        const allMounts = this.mounts[type].trim().split(/\s+/);
        
        const keyMappings = {
            'up': ['上拨.rc', '上拨复位.rc'],
            'down': ['下拨.rc', '下拨复位.rc'],
            'dc': ['双击.rc', '双击复位.rc'],
            'lp': ['长按.rc', '长按复位.rc'],
            'vup_dc': ['双击.rc', '双击复位.rc'],
            'vup_lp': ['长按.rc', '长按复位.rc'],
            'vdown_dc': ['双击.rc', '双击复位.rc'],
            'vdown_lp': ['长按.rc', '长按复位.rc'],
            'power_dc': ['双击.rc', '双击复位.rc'],
            'power_lp': ['长按.rc', '长按复位.rc']
        };
        
        const keyFiles = keyMappings[key] || [];
        const filteredMounts = [];
        
        for (let i = 0; i < allMounts.length; i += 2) {
            const srcPath = allMounts[i];
            const dstPath = allMounts[i + 1];
            if (keyFiles.some(fileName => srcPath.includes(fileName))) {
                filteredMounts.push(srcPath, dstPath);
            }
        }
        
        if (enable) {
            const placeholder = Utils.unicodeBtoa('#!/system/bin/sh\n# 请在此处添加您想执行的shell命令');
            let cmd = '';
            filteredMounts.filter((_, i) => i % 2 === 0).forEach(src => {
                cmd += `f="${src}"; d=$(dirname "$f"); [ -d "$d" ] || mkdir -p "$d"; [ -f "$f" ] || (echo "${placeholder}" | base64 -d > "$f"); `;
            });
            if (cmd) await Executor.exec(cmd);
        }
        
        let subCmd = '';
        for (let i = 0; i < filteredMounts.length; i += 2) {
            if (enable) {
                subCmd += `if [ -f "${filteredMounts[i]}" ]; then d=$(dirname "${filteredMounts[i + 1]}"); mkdir -p "$d"; touch "${filteredMounts[i + 1]}"; umount "${filteredMounts[i + 1]}" 2>/dev/null; mount --bind "${filteredMounts[i]}" "${filteredMounts[i + 1]}"; fi; `;
            } else {
                subCmd += `umount "${filteredMounts[i + 1]}" 2>/dev/null; `;
            }
        }
        if (subCmd) await Executor.exec(`nsenter -t 1 -m -- sh -c '${subCmd}'`);
    }
    async updateModuleDescription(isRunning) {
        const baseText = "拓展三段式侧键的上拨和下拨 快捷单侧键、音量上下键、电源键的双击和长按功能支持自定义";
        const newDescription = isRunning ? `description=运行中 | ${baseText}` : `description=未运行 | ${baseText}`;
        try {
            await Executor.exec(`sed -i "s/^description=.*/${newDescription}/" "${this.paths.moduleProp}"`);
        } catch (e) {
            Logger.log(`更新模块描述失败: ${e.message}`, 'warn');
        }
    }
    async loadState() {
        if (this.busy) return;
        this.busy = true;
        try {
            if (document.body) document.body.style.cursor = 'wait';
            const rawStates = Utils.parseKvData(await Executor.exec(`cat ${this.paths.configFile} 2>/dev/null || echo ""`));
            const states = {};
            for (const key in rawStates) {
                if (key.startsWith('BIND_')) states[key.substring(5)] = rawStates[key];
            }
            const isRunning = await this.isModuleRunning();
            await this.updateModuleDescription(isRunning);
            
            const customKeysToMount = [];
            
            let hasBindings = false;
            Object.keys(this.keyMap).forEach(key => {
                const value = states[key] || '0';
                
                if (value === '2') {
                    const customType = this.getCustomTypeFromKey(key);
                    if (customType) {
                        customKeysToMount.push({ key, customType });
                    }
                }
                
                const grid = document.getElementById(`${key}-grid`);
                if (grid) {
                    grid.querySelectorAll('.feature-card').forEach(card => {
                        card.classList.remove('active');
                        if (value === '2' && card.dataset.feature === 'custom') {
                            card.classList.add('active');
                            if (!this.animationCompleted) {
                                card.classList.add('defer-active');
                            }
                        } else if (card.dataset.feature === value) {
                            card.classList.add('active');
                            if (!this.animationCompleted) {
                                card.classList.add('defer-active');
                            }
                        }
                    });
                    
                    const keySection = grid.closest('.key-section');
                    const editBtn = keySection?.querySelector('.btn-edit');
                    if (editBtn) {
                        editBtn.style.display = value === '2' ? 'inline-block' : 'none';
                    }
                }
                
                if (value !== '0') {
                    hasBindings = true;
                }
            });
            
            for (const { key, customType } of customKeysToMount) {
                await this.toggleCustomModeForKey(customType, key, true, true);
            }
            
            const shieldToggle = document.getElementById('shield-toggle');
            if (shieldToggle) shieldToggle.checked = states['shielded'] === '0';
            await this.calibrationManager.checkCalibration();
        } catch (e) {
            Logger.log(`加载失败: ${e.message}`, 'err', true);
        } finally {
            this.busy = false;
            if (document.body) document.body.style.cursor = 'default';
        }
    }
    async autoStartService(isSilent = false) {
        await Executor.exec(`${this.paths.portalScript} stopall 2>/dev/null`);
        await Utils.sleep(50);
        
        const sentinelRunning = await Executor.exec(`pgrep -f "${this.paths.sentinelScript}" | head -1`);
        if (!sentinelRunning) {
            const errorMsg = 'Sentinel守护进程未运行，无法启动服务';
            throw new Error(errorMsg);
        }
        
        await Executor.exec(`${this.paths.portalScript} start_all`);
        await Utils.sleep(50);
    }
    async updateSwitchStatesAndAutoStart(isSilent = true) {
        const rawStates = Utils.parseKvData(await Executor.exec(`cat ${this.paths.configFile} 2>/dev/null || echo ""`));
        const isActive = (key) => rawStates[`BIND_${key}`] && rawStates[`BIND_${key}`] !== '0';
        
        const switches = {
            TRIKEY: isActive('up') || isActive('down'),
            BTN32: isActive('dc') || isActive('lp'),
            VUP: isActive('vup_dc') || isActive('vup_lp'),
            VDOWN: isActive('vdown_dc') || isActive('vdown_lp'),
            POWER: isActive('power_dc') || isActive('power_lp')
        };
        
        const enabledModules = [];
        for (const key in switches) {
            const newValue = switches[key] ? 1 : 0;
            await Executor.setKv(this.paths.configFile, `SWITCH_${key}`, newValue);
            if (newValue === 1) {
                enabledModules.push(key);
            }
        }
        
        const hasAnyEnabled = enabledModules.length > 0;
        
        if (hasAnyEnabled) {
            if (!isSilent) {
                Logger.log(`模块状态: ${enabledModules.join(', ')} 已激活`, 'info');
            }
            await this.autoStartService(isSilent);
        } else {
            await Executor.exec(`${this.paths.portalScript} stopall 2>/dev/null`);
            if (!isSilent) {
                Logger.log('→ 无激活模块，服务已停止', 'info');
            }
        }
    }
    async ensureShellTxt() {
        if (await Executor.exec(`[ -s "${this.paths.shellTxt}" ] && echo "exists" || echo "missing"`) === "missing") {
            const errorMsg = 'shell.txt 文件不存在，请检查模块文件是否完整';
            Logger.log(errorMsg, 'err', true);
            throw new Error(errorMsg);
        }
    }
    async isModuleRunning() {
        try {
            const result = await Executor.exec(`${this.paths.portalScript} status 2>/dev/null || echo "STOPPED"`);
            return result.trim().startsWith('RUNNING:');
        } catch (e) {
            return false;
        }
    }
}
window.keyExtenderUI = new KeyExtenderUI();
