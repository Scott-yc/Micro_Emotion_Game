
import { audioConfig, PlayerMessage } from "./config/Config";
import Tip_UI from "./Tip_UI";
import { AudioMgr } from "./work/AudioMgr";
import { ManagerAD } from "./work/ManagerAD";
import { ManagerUI } from "./work/ManagerUI";
import { NetWork } from "./work/NetWork";
import { Observer } from "./work/Observer";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Gold_UI extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() { }

    onEnable() {
        // ManagerAD.showInterstitialAd()
        let goldNum = PlayerMessage.PlayVideoScore;
        this.label.string = "+" + goldNum;
    }

    /**看广告得积分 */
    ggClick() {
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        //广告看完
        ManagerAD.showIncentiveAD((msg) => {
            console.log('Gold_UI ', msg)
            AudioMgr.playAudioEffect(audioConfig.gold)
            Observer.emit("gameScore", PlayerMessage.PlayVideoScore)
            Observer.emit("gameStop")
            ManagerUI.closeUI("Gold_UI");
        }, (msg) => {
            console.log('Gold_UI fail', msg)
        })
        // Tip_UI.Instance.tipShow("暂无广告")
        // AudioMgr.playAudioEffect(audioConfig.gold)
        // Observer.emit("gameScore",200)
        // Observer.emit("gameStop")
        // ManagerUI.closeUI("Gold_UI");
        // // NetWork.getAddScoreMesssage((bool,res,msg)=>{
        // //     if(bool){

        // //     }
        // // })
    }

    /**返回首页 */
    backHomeClick() {
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        Observer.emit("gameStop")
        ManagerUI.closeUI("Gold_UI");
    }

    // update (dt) {}
}
