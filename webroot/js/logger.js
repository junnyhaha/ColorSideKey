class Logger {
    static log(msg, type = '', overwrite = false) {
        const text = typeof msg === 'string' ? msg : String(msg);
        const durations = { success: 1600, warn: 2000, err: 2200, error: 2200 };
        const methods = { warn: 'warn', err: 'error', error: 'error' };
        console[methods[type] || 'log'](text);
        if (durations[type] || overwrite) Utils.showToast(text, durations[type] || 1500);
        }
    static clearLog() {
        try { console.clear(); } catch (_) {}
    }
}
window.Logger = Logger;
