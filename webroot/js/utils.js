class Utils {
    static unicodeBtoa(str) {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p) => String.fromCharCode(parseInt(p, 16))));
    }
    static sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    static parseKvData(data) {
        return data.split('\n').reduce((acc, line) => {
            const idx = line.indexOf('=');
            if (idx > -1) {
                const key = line.slice(0, idx).trim();
                const val = line.slice(idx + 1).trim();
                if (key) acc[key] = val;
            }
            return acc;
        }, {});
    }
    static getDistance(touches) {
        return Math.hypot(touches[1].clientX - touches[0].clientX, touches[1].clientY - touches[0].clientY);
    }
    static showToast(message, duration = 1500) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        if (this.toastTimeout) clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => toast.classList.remove('show'), duration);
    }
}
window.Utils = Utils;
