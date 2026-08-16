export const eventMgr = {
    _listener: {},

    // 发送事件
    emit(event: string, data?: any) {
        if (!this._listener[event]) return;
        let tabListener = this._listener[event];
        for (let idx = 0; idx < tabListener.length; idx++) {
            let tab = tabListener[idx];
            tab.func.call(tab.target, data);
        }
    },

    // 添加事件回调
    on(event: string, callback: Function, dst: cc.Component) {
        if (!this._listener[event]) {
            this._listener[event] = [];
        }
        let tab = {}
        tab['target'] = dst;
        tab['func'] = callback;
        this._listener[event].push(tab);
    },
    /**解除所有事件监听 */
    offAllListener(dst: cc.Component) {
        for (const event in this._listener) {
            let listen = this._listener[event];
            for (let idx = listen.length - 1; idx >= 0; idx--) {
                let tab = listen[idx];
                if (tab['target'] == dst) {
                    listen.splice(idx, 1);
                }
            }
        }
    }
}