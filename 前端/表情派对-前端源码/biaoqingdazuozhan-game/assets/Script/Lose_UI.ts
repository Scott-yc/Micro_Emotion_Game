
import { audioConfig } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { ManagerUI } from "./work/ManagerUI";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Lose_UI extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    onEnable () {
        this.label.string = "+200";
    }

    /**看广告得积分 */
    ggClick(){
        AudioMgr.playAudioEffect(audioConfig.btnClick)
    }

    /**返回首页 */
    backHomeClick(){
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        ManagerUI.closeUI("Lose_UI");
    }

    // update (dt) {}
}
