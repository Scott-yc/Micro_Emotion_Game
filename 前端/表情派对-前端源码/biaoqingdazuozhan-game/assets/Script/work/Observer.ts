export const Observer = new class{
    private notification = new cc.EventTarget();

    /**注册事件 */
    public on(name: string, callBack: Function, target?: any){
        this.notification.on(name, callBack, target);
    }
    /**发送事件 */
    public emit(name: string,...arg){
        this.notification.emit(name, ...arg);
    }
    /**注销事件 */
    public off(name: string){
        this.notification.off(name);
    }

}