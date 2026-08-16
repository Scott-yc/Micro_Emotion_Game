

import { audioConfig, rankMessageArr, shopListArr } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { Observer } from "./work/Observer";
import { ResourcesMgr } from "./work/ResourcesMgr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopItem extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: "皮肤Mc",
    })
    private jpMc: cc.Node = null;

    @property({
        type: cc.Label,
        tooltip: "名字",
    })
    private nameTxt: cc.Label = null;

    @property({
        type: cc.Node,
        tooltip: "广告/兑换",
    })
    private ggdhNode: cc.Node[] = [];

    @property({
        type: cc.Node,
        tooltip: "按钮",
    })
    private dhBtnNode: cc.Node[] = [];

    @property({
        type: cc.Label,
        tooltip: "价格",
    })
    private moneyTxt: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    /**item显示 */
    public itemShow(ai:number,sf:any){
        // ResourcesMgr.loadImgByUrl(this.jpMc,shopListArr[ai].image,"png");
        this.jpMc.getComponent(cc.Sprite).spriteFrame = sf
        this.nameTxt.string = shopListArr[ai].name;
        this.moneyTxt.string = shopListArr[ai].number;
        if(shopListArr[ai].obtain_type == 0){//未获得
            if(shopListArr[ai].access == 1){//视频
                this.ggdhNode[0].active = true;
                this.ggdhNode[1].active = false;
                this.dhBtnNode[0].active = true;
                this.dhBtnNode[1].active = false;
                this.dhBtnNode[2].active = false;
            }else{//兑换
                this.ggdhNode[0].active = false;
                this.ggdhNode[1].active = true;
                this.dhBtnNode[0].active = false;
                this.dhBtnNode[1].active = true;
                this.dhBtnNode[2].active = false;
            }
        }else{//已获得
            this.ggdhNode[0].active = false;
            this.ggdhNode[1].active = false;
            this.dhBtnNode[0].active = false;
            this.dhBtnNode[1].active = false;
            this.dhBtnNode[2].active = true;
        }
    }

    itemClick(event){
        AudioMgr.playAudioEffect(audioConfig.btnClick);
        let shopName = event.target.name;
        // console.log("shopName:" + shopName)
        let thId = shopName.substr(2);
        // console.log("游戏ID：" + shopName);
        let tempNum = Number(thId);
        Observer.emit("shopListShow",tempNum)
    }

    videoClick(event){
        AudioMgr.playAudioEffect(audioConfig.btnClick);
        let shopName = event.target.name;
        // console.log("shopName:" + shopName)
        let thId = shopName.substr(2);
        console.log("游戏ID：" + shopName);
        let tempNum = Number(thId);
        Observer.emit("shopVideoShow",tempNum)
    }
    // update (dt) {}
}
