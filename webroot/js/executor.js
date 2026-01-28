class Executor {
    static async exec(cmd, retries = 3) {
        return new Promise((resolve, reject) => {
            try {
                if (typeof ksu === 'undefined' && typeof su === 'undefined') {
                    console.warn(`Mock Exec: ${cmd}`);
                    resolve('');
                    return;
                }
                const cb = `cb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
                window[cb] = (code, stdout, stderr) => {
                    try {
                        delete window[cb];
                        if (code === 0) {
                            resolve(stdout ? stdout.trim() : '');
                        } else {
                            const error = (stderr ? stderr.trim() : '') || `命令执行失败，代码: ${code}`;
                            if (retries > 0 && (error.includes('Device or resource busy') || error.includes('Permission denied'))) {
                                setTimeout(() => Executor.exec(cmd, retries - 1).then(resolve).catch(reject), 1000);
                            } else {
                                reject(new Error(error));
                            }
                        }
                    } catch (callbackError) {
                        reject(new Error(`回调处理错误: ${callbackError.message}`));
                    }
                };
                const execFunction = typeof ksu !== 'undefined' ? ksu : su;
                if (execFunction && typeof execFunction.exec === 'function') {
                    execFunction.exec(cmd, JSON.stringify({ cmd, callback: cb }), cb);
                } else {
                    reject(new Error('执行环境不可用'));
                }
            } catch (e) {
                if (typeof cb !== 'undefined' && window[cb]) delete window[cb];
                reject(new Error(`执行命令时出错: ${e.message}`));
            }
        });
    }
    static async setKv(file, key, val) {
        await this.exec(`sh -c 'if grep -q "^${key}=" "${file}" 2>/dev/null; then sed -i "s/^${key}=.*/${key}=${val}/" "${file}"; else echo "${key}=${val}" >> "${file}"; fi'`);
    }
}
window.Executor = Executor;
