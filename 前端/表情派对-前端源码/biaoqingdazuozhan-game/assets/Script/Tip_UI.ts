
const {ccclass, property} = cc._decorator;

@ccclass
export default class Tip_UI extends cc.Component {
    /**UI_Tip 静态单例 */
    public static Instance: Tip_UI = null;

    /**持续时间 */
    private resT: number = 2;
    /**当前时间 */
    private curT: number = 0;
    onLoad(){
        Tip_UI.Instance = this;
        this.node.zIndex = 10;
        this.tipShow(null);
    }

    onEnable(){
        this.curT = 0;
    }

    public tipShow(str: string){
        if(!str || str.length <= 0){
            this.node.active = false;
            return;
        }
        let txt = this.node.getChildByName("txt").getComponent(cc.Label);
        let bg = this.node.getChildByName("bg");
        txt.string = str;
        bg.width = 30 * str.length + 60;
        this.node.active = true;
    }

    update(dt){
        this.curT += dt;
        if(this.curT >= this.resT){
            this.node.active = false;
        }
    }
}
