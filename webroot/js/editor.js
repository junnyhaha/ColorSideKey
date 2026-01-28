class EditorManager {
    constructor(app) {
        this.app = app;
        this.editorState = null;
        this.editorZoom = { baseFontSize: 13, isPinching: false, initialPinchDistance: 0, currentScale: 1 };
        this.keyToFileNames = {
            'up': ['上拨.rc', '上拨复位.rc'], 'down': ['下拨.rc', '下拨复位.rc'],
            'dc': ['双击.rc', '双击复位.rc'], 'lp': ['长按.rc', '长按复位.rc'],
            'vup_dc': ['双击.rc', '双击复位.rc'], 'vup_lp': ['长按.rc', '长按复位.rc'],
            'vdown_dc': ['双击.rc', '双击复位.rc'], 'vdown_lp': ['长按.rc', '长按复位.rc'],
            'power_dc': ['双击.rc', '双击复位.rc'], 'power_lp': ['长按.rc', '长按复位.rc']
        };
    }
    async openEditor(type, key) {
        if (this.app.busy) return;
        this.app.busy = true;
        try {
            const mounts = this.app.mounts[type].trim().split(/\s+/);
            const targetFileNames = this.keyToFileNames[key] || [];
            const filePairs = [];
            for (let i = 0; i < mounts.length; i += 2) {
                const rcPath = mounts[i];
                const rcFileName = rcPath.substring(rcPath.lastIndexOf('/') + 1);
                if (targetFileNames.includes(rcFileName)) filePairs.push({ rcPath, shPath: mounts[i + 1], rcFileName });
                }
            if (filePairs.length === 0) { Utils.showToast('未找到相关文件'); return; }
            for (const { rcPath } of filePairs) {
                const fileExists = await Executor.exec(`[ -f "${rcPath}" ] && echo "1" || echo "0"`);
                if (fileExists.trim() !== '1') {
                    const content = Utils.unicodeBtoa('#!/system/bin/sh\n# 请在此处添加您想执行的shell命令\n');
                    await Executor.exec(`mkdir -p "${rcPath.substring(0, rcPath.lastIndexOf('/'))}"; echo '${content}' | base64 -d > "${rcPath}"`);
                }
            }
            const files = await Promise.all(filePairs.map(async ({ rcPath, rcFileName }) => ({
                    path: rcPath,
                    shortName: rcFileName,
                displayName: rcFileName.replace('.rc', ''),
                    content: await Executor.exec(`cat "${rcPath}" 2>/dev/null || echo "#!/system/bin/sh\n# 请在此处添加您想执行的shell命令\n"`)
            })));
            this.editorState = { type, key, activeIndex: -1, files };
            this.resetEditorZoom();
            this.renderEditorTabs(files);
            this.switchEditorTab(0);
            requestAnimationFrame(() => this.app.uiManager.openModal(document.getElementById('editor-modal')));
        } catch (e) {
            Logger.log(`无法读取文件: ${e.message}`, 'err', true);
            Utils.showToast('读取失败');
        } finally {
            this.app.busy = false;
        }
    }
    resetEditorZoom() {
        this.editorZoom.currentScale = 1;
        const [textarea, lineNumbers, editorContainer] = ['editor-textarea', 'line-numbers', 'editor-container'].map(id => document.getElementById(id));
        if (textarea && lineNumbers && editorContainer) {
            const baseSize = `${this.editorZoom.baseFontSize}px`;
            textarea.style.fontSize = lineNumbers.style.fontSize = baseSize;
            editorContainer.scrollTop = editorContainer.scrollLeft = 0;
        }
    }
    renderEditorTabs(files) {
        const tabsContainer = document.getElementById('editor-tabs');
        tabsContainer.innerHTML = '';
        files.forEach((file, index) => {
            const tab = document.createElement('div');
            tab.className = 'editor-tab';
            const name = file.displayName;
            if (name.includes('双击')) tab.classList.add('color-dc');
            else if (name.includes('长按')) tab.classList.add('color-lp');
            else if (name.includes('上拨')) tab.classList.add('color-up');
            else if (name.includes('下拨')) tab.classList.add('color-down');
            tab.textContent = file.displayName;
            tab.dataset.indices = JSON.stringify([index]);
            tab.onclick = () => this.switchEditorTab(index);
            if (index === 0) tab.classList.add('active');
            tabsContainer.appendChild(tab);
        });
    }
    switchEditorTab(index) {
        if (!this.editorState) return;
        const textarea = document.getElementById('editor-textarea');
        const activeTab = document.querySelector('.editor-tab.active');
        if (activeTab && this.editorState.activeIndex !== -1) {
            JSON.parse(activeTab.dataset.indices || '[]').forEach(idx => {
                if (this.editorState.files[idx]) this.editorState.files[idx].content = textarea.value;
            });
        }
        this.editorState.activeIndex = index;
        let currentIndices = [index];
        document.querySelectorAll('.editor-tab').forEach(tab => {
            const tabIndices = JSON.parse(tab.dataset.indices || '[]');
            const isActive = tabIndices.includes(index);
            tab.classList.toggle('active', isActive);
            if (isActive) currentIndices = tabIndices;
        });
        textarea.value = this.editorState.files[index].content;
        document.getElementById('editor-title').textContent = currentIndices.map(idx => this.editorState.files[idx]?.displayName).filter(Boolean).join(' ');
        document.getElementById('editor-container').scrollTop = 0;
        this.updateLineNumbers();
    }
    async saveFile() {
        if (this.app.busy || !this.editorState) return;
        const textarea = document.getElementById('editor-textarea');
        const activeTab = document.querySelector('.editor-tab.active');
        if (!activeTab) return;
        const activeIndices = JSON.parse(activeTab.dataset.indices || '[]');
        activeIndices.forEach(idx => { if (this.editorState.files[idx]) this.editorState.files[idx].content = textarea.value; });
        const btn = document.getElementById('editor-save-btn');
        if (btn) { btn.disabled = true; btn.textContent = '保存中...'; }
        try {
            for (const idx of activeIndices) {
                const fileToSave = this.editorState.files[idx];
                if (fileToSave) {
                    await Executor.exec(`echo '${Utils.unicodeBtoa(fileToSave.content)}' | base64 -d > "${fileToSave.path}"`);
                    Logger.log(`${fileToSave.displayName} 已更新`, 'success');
                }
            }
            const mainFile = this.editorState.files[activeIndices[0]];
            Utils.showToast(activeIndices.length > 1 ? `${mainFile.displayName} 及复位已保存` : `${mainFile.displayName} 已保存`);
        } catch (e) {
            Logger.log(`保存失败: ${e.message}`, 'err', true);
            Utils.showToast('保存失败');
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = '保存'; }
        }
    }
    closeEditor() {
        this.app.uiManager.closeModal(document.getElementById('editor-modal'));
        this.editorState = null;
    }
    updateLineNumbers() {
        const textarea = document.getElementById('editor-textarea');
        const lineNumbers = document.getElementById('line-numbers');
        if (!textarea || !lineNumbers) return;
        const lineCount = textarea.value.split('\n').length;
        if (lineCount === lineNumbers.textContent.split('\n').length && lineNumbers.textContent !== "") return;
        lineNumbers.textContent = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');
        const linesEl = document.getElementById('editor-lines');
        const charsEl = document.getElementById('editor-chars');
        if (linesEl) linesEl.textContent = `行数: ${lineCount}`;
        if (charsEl) charsEl.textContent = `字符: ${textarea.value.length}`;
    }
    handleEditorTouchStart(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            this.editorZoom.isPinching = true;
            this.editorZoom.initialPinchDistance = Utils.getDistance(e.touches);
        }
    }
    handleEditorTouchMove(e) {
        if (this.editorZoom.isPinching && e.touches.length === 2) {
            e.preventDefault();
            const newScale = Math.max(0.5, Math.min(this.editorZoom.currentScale * (Utils.getDistance(e.touches) / this.editorZoom.initialPinchDistance), 3.0));
            const newFontSize = `${this.editorZoom.baseFontSize * newScale}px`;
            const [textarea, lineNumbers] = ['editor-textarea', 'line-numbers'].map(id => document.getElementById(id));
            if (textarea && lineNumbers) { textarea.style.fontSize = lineNumbers.style.fontSize = newFontSize; }
        }
    }
    handleEditorTouchEnd(e) {
        if (e.touches.length < 2 && this.editorZoom.isPinching) {
            this.editorZoom.isPinching = false;
            this.editorZoom.initialPinchDistance = 0;
            const textarea = document.getElementById('editor-textarea');
            if (textarea) this.editorZoom.currentScale = parseFloat(window.getComputedStyle(textarea).fontSize) / this.editorZoom.baseFontSize;
        }
    }
}
window.EditorManager = EditorManager;
