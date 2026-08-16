

import { audioConfig, rankMessageArr } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { ManagerAD } from "./work/ManagerAD";
import { ManagerUI } from "./work/ManagerUI";
import { Message, MessageType } from "./work/Message";
import { NetWork } from "./work/NetWork";
import { Observer } from "./work/Observer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rank_UI extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: "排行content"
    })
    private phContent: cc.Node = null;

    @property({
        type: cc.Prefab,
        tooltip: "排行Item "
    })
    private PhItem: cc.Prefab = null;

    @property({
        type: cc.SpriteFrame,
        tooltip: "奖杯"
    })
    private jbSf: cc.SpriteFrame[] = [];

    @property({
        type: cc.Node,
        tooltip: "sub"
    })
    private subNode: cc.Node = null;


    private ranklegth = 50;
    private GameType = 1;

    onLoad() {
        this.node.zIndex = 10;
    }

    onEnable() {
        // ManagerAD.showInterstitialAd()
        // this.getDataShow();
        AudioMgr.stopBgMusic();
        AudioMgr.playBGMusic(audioConfig.rankBgSD);
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            console.log("--------------------------")
            // wx.getOpenDataContext().postMessage(new Message(MessageType.CLEAR));
            wx.getOpenDataContext().postMessage(new Message(MessageType.FRIEND_RANK));
        }
        setTimeout(() => {
            this.subNode.getComponent(cc.SubContextView).reset()
        }, 500);

        // if(cc.sys.platform == cc.sys.WECHAT_GAME){
        //     wx.onShow(()=>{
        //         AudioMgr.playBGMusic(audioConfig.rankBgSD)
        //     })
        // }
    }

    /**获取信息 */
    // private getDataShow(){
    //     NetWork.getRankMesssage((bool,res,msg) => {
    //         if (res) {
    //             let rankLen = res.data.length;
    //             rankMessageArr.length = 0;
    //             for (let a = 0; a < rankLen; a++) {
    //                 rankMessageArr.push(res.data[a]);
    //             }
    //             console.log(rankMessageArr);
    //             this.itemShow();
    //         }
    //     })
    // }

    // /**好友 */
    // itemShow() {
    //     this.ranklegth = rankMessageArr.length;
    //     let contents = this.phContent;
    //     if (contents.childrenCount > 0) {
    //         contents.removeAllChildren();
    //     }
    //     if (this.ranklegth > 0) {
    //         for (let i = 0; i < this.ranklegth; i++) {
    //             let item = cc.instantiate(this.PhItem);
    //             contents.addChild(item);
    //             item.name = "rn" + i;
    //             let view = item.getComponent("Rank_Item");
    //             view.itemShow(i,this.jbSf[i])
                
    //         }
    //     }
    // }

    /**关闭按钮点击 */
    private closeClick() {
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            wx.getOpenDataContext().postMessage(new Message(MessageType.CLEAR));
        }
        Observer.emit("musicBG")
        ManagerUI.closeUI(this.node.name);
    }
}

