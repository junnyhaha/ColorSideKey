class UIManager {
    constructor(app) { this.app = app; }
    openModal(modalElement) {
        if (!modalElement) return;
        document.documentElement.style.setProperty('--scrollbar-width', `${window.innerWidth - document.documentElement.clientWidth}px`);
        modalElement.classList.add('visible');
        document.body.classList.add('modal-open');
    }
    closeModal(modalElement) {
        if (!modalElement) return;
        modalElement.classList.remove('visible');
        document.body.classList.remove('modal-open');
        document.documentElement.style.setProperty('--scrollbar-width', '0px');
    }
    showPremiumModal() { this.openModal(document.getElementById('premium-modal')); }
    hidePremiumModal() { this.closeModal(document.getElementById('premium-modal')); }
    showImageModal() { this.openModal(document.getElementById('image-modal')); }
    hideImageModal() { this.closeModal(document.getElementById('image-modal')); }
    showComingSoonModal() { this.openModal(document.getElementById('coming-soon-modal')); }
    hideComingSoonModal() { this.closeModal(document.getElementById('coming-soon-modal')); }
    updatePremiumUI(isUnlocked) {
        const proBadge = document.querySelector('.pro-badge');
        if (proBadge) proBadge.style.display = isUnlocked ? 'inline-block' : 'none';
    }
    populateFeatureGrids(features, isUnlocked, freeFeatures) {
        const grids = document.querySelectorAll('.feature-grid');
        if (!grids || grids.length === 0) return;
        const keyToCustomType = { 'up': 'sdk', 'down': 'sdk', 'dc': 'cbk', 'lp': 'cbk', 'vup_dc': 'vuk', 'vup_lp': 'vuk', 'vdown_dc': 'vdk', 'vdown_lp': 'vdk', 'power_dc': 'dyk', 'power_lp': 'dyk' };
        grids.forEach(grid => {
            const key = grid.dataset.key;
            if (!key) return;
            const customType = keyToCustomType[key];
            const needsPremium = ['vuk', 'vdk', 'dyk'].includes(customType);
            const canUseCustom = isUnlocked || !needsPremium;
            let cardsHtml = `<div class="feature-card none-card" data-feature="0" data-key="${key}">关闭</div>`;
            cardsHtml += `<div class="feature-card custom-card ${!canUseCustom ? 'locked' : ''}" data-feature="custom" data-key="${key}" data-custom-type="${customType}" ${!canUseCustom ? 'data-locked="true"' : ''}>自定义</div>`;
            features.forEach(f => {
                const isLocked = !isUnlocked && !freeFeatures.includes(f.name);
                cardsHtml += `<div class="feature-card ${isLocked ? 'locked' : ''}" data-feature="${f.name}" data-key="${key}" ${isLocked ? 'data-locked="true"' : ''}>${f.name}</div>`;
            });
            cardsHtml += `<div class="feature-card coming-soon-card" data-feature="coming-soon" data-key="${key}">敬请期待</div>`;
            grid.innerHTML = cardsHtml;
            const keySection = grid.closest('.key-section');
            if (keySection && customType && !keySection.querySelector('.btn-edit')) {
                    const titleDiv = keySection.querySelector('.key-section-title');
                    if (titleDiv) {
                    const editBtn = document.createElement('button');
                        editBtn.className = 'btn btn-secondary btn-edit btn-mini';
                        editBtn.textContent = '编辑';
                        editBtn.dataset.type = customType;
                        editBtn.dataset.key = key;
                        editBtn.style.display = 'none';
                        titleDiv.appendChild(editBtn);
                }
            }
        });
    }
    async updateCalibrationUI(isCalibrated) {
        document.querySelectorAll('.uncalibrated-notice[data-hw-type="volume"]').forEach(n => n.style.display = isCalibrated ? 'none' : 'block');
        document.querySelectorAll('.calibrated-content[data-hw-type="volume"]').forEach(c => c.style.display = isCalibrated ? 'block' : 'none');
    }
}
window.UIManager = UIManager;
