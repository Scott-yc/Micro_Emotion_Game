

import { audioConfig, shopListArr } from "./config/Config";
import Tip_UI from "./Tip_UI";
import { AudioMgr } from "./work/AudioMgr";
import { ManagerAD } from "./work/ManagerAD";
import { ManagerUI } from "./work/ManagerUI";
import { NetWork } from "./work/NetWork";
import { Observer } from "./work/Observer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Shop_UI extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: "商城content"
    })
    private shopContent: cc.Node = null;

    @property({
        type: cc.Prefab,
        tooltip: "商城Item "
    })
    private shopItem: cc.Prefab = null;

    @property({
        type: cc.SpriteFrame,
        tooltip: "图片"
    })
    private shopItemSF: cc.SpriteFrame[] = [];

    private shopListlegth = 0;

    onLoad() {
        Observer.on("shopListShow", function (id) {
            this.shopItemShow(id)
        }, this)
        Observer.on("shopVideoShow", function (id) {
            this.shopVideoShow(id)
        }, this)
    }

    onEnable() {
        // ManagerAD.showInterstitialAd()
        AudioMgr.stopBgMusic();
        AudioMgr.playBGMusic(audioConfig.shopBgSD);
        this.init();
        //    if(cc.sys.platform == cc.sys.WECHAT_GAME){
        //     wx.onShow(()=>{
        //         AudioMgr.playBGMusic(audioConfig.shopBgSD)
        //     })
        //     }
    }

    init() {
        NetWork.getShopMesssage((bool, res, msg) => {
            if (bool) {
                this.itemShow();
            }
        })
    }


    /** */
    itemShow() {
        this.shopListlegth = shopListArr.length;
        let contents = this.shopContent;
        if (contents.childrenCount > 0) {
            contents.removeAllChildren();
        }
        if (this.shopListlegth > 0) {
            for (let i = 0; i < this.shopListlegth; i++) {
                let item = cc.instantiate(this.shopItem);
                contents.addChild(item);
                item.getChildByName("anNode").getChildByName("免费").name = "sh" + i;
                item.getChildByName("anNode").getChildByName("兑换").name = "dh" + i;
                let view = item.getComponent("ShopItem");
                view.itemShow(i, this.shopItemSF[(shopListArr[i].id) - 1])

            }
        }
    }

    // let  at = window.navigator.userAgent.toLowerCase()
    // at.match

    /** */
    shopItemShow(id) {
        console.log(id)
        let sId = shopListArr[id].id
        console.log(sId)
        console.log("----------------------------------")
        NetWork.setExchangeMesssage(sId, (bool, res, msg) => {
            Tip_UI.Instance.tipShow(msg)
            if (bool) {
                NetWork.getShopMesssage((bool, res, msg) => {
                    if (bool) {
                        this.itemShow();
                        Observer.emit("updataSkin")
                        Observer.emit("csShow")
                    }
                })
            }
        })
    }

    /**视频 */
    shopVideoShow(id) {
        console.log("点击ID：" + id)
        // Tip_UI.Instance.tipShow("暂无视频")
        ManagerAD.showIncentiveAD((msg) => {
            console.log('Shop_UI ', msg)
            let sId = shopListArr[id].id
            console.log("发送ID：" + sId)
            NetWork.setExchangeMesssage(sId, (bool, res, msg) => {
                Tip_UI.Instance.tipShow(msg)
                if (bool) {
                    NetWork.getShopMesssage((bool, res, msg) => {
                        if (bool) {
                            this.itemShow();
                            Observer.emit("updataSkin")
                            Observer.emit("csShow")
                        }
                    })
                }
            })
        }, (msg) => {
            console.log('Shop_UI fail', msg)
        })
    }


    /**返回首页 */
    backHomeClick() {
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        Observer.emit("musicBG")
        ManagerUI.closeUI("Shop_UI");
    }

    // update (dt) {}
}
