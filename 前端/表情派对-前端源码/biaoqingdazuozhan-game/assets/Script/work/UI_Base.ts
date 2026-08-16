
const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Base extends cc.Component {
    @property({
        type: cc.Node,
        tooltip: "需要缩放动效的节点",
    })
    private contentNode: cc.Node = null;

    onLoad(){
    }
    
    onEnable(){
        if(this.contentNode){
            this.showScaleAni();
        }
    }

    /**显示缩放动效 */
    showScaleAni(){
        this.contentNode.stopAllActions();
        this.contentNode.scale = 0;
        cc.tween(this.contentNode)
            .to(0.4, {scale : 1}, {easing: 'backOut'})
            .start()
    }
}
