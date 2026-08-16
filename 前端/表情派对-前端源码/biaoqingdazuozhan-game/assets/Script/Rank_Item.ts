

import { gameMessage, rankMessageArr } from "./config/Config";
import { ResourcesMgr } from "./work/ResourcesMgr";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Rank_Item extends cc.Component {

    @property({
        type: cc.Sprite,
        tooltip: "奖励Mc",
    })
    private jpMc: cc.Sprite = null;

    @property({
        type: cc.Label,
        tooltip: "排名",
    })
    private pmTxt: cc.Label = null;

    @property({
        type: cc.Node,
        tooltip: "头像",
    })
    private headMc: cc.Node = null;

    @property({
        type: cc.Label,
        tooltip: "名字",
    })
    private nameTxt: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "天数",
    })
    private tianTxt: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "分数",
    })
    private scoreTxt: cc.Label = null;

    @property({
        type: cc.Node,
        tooltip: "皮肤",
    })
    private skinMc: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    /**item显示 */
    public itemShow(ai:number,sfMc:any){
        if(ai < 3){
            this.jpMc.spriteFrame = sfMc;//奖杯
            this.pmTxt.string = "";//排名
        }else{
            this.pmTxt.string = (ai+1)+"";//排名
            this.jpMc.spriteFrame = null
        }
        this.nameTxt.string = rankMessageArr[ai].user.nickname;
        this.scoreTxt.string = Number(rankMessageArr[ai].score) + "";
        this.tianTxt.string = Number(rankMessageArr[ai].day) + "";
        ResourcesMgr.loadImgByUrl(this.headMc,rankMessageArr[ai].user.avatar,"png");
        ResourcesMgr.loadImgByUrl(this.skinMc,rankMessageArr[ai].skin.image,"png");
    }
    // update (dt) {}
}
