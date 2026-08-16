import { ResourcesMgr } from "./ResourcesMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankItem extends cc.Component {

    @property({
        type: cc.Label,
        tooltip: "名次"
    })
    private ncTxt: cc.Label = null;

    @property({
        type: cc.Sprite,
        tooltip: "奖杯图"
    })
    private jbTxt: cc.Sprite = null;

    @property({
        type: cc.Node,
        tooltip: "头像"
    })
    private txNode: cc.Node = null;

    @property({
        type: cc.Label,
        tooltip: "名字"
    })
    private nameTxt: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "天数"
    })
    private tianTxt: cc.Label = null;

    @property({
        type: cc.Sprite,
        tooltip: "主角"
    })
    private zjNode: cc.Sprite = null;

    @property({
        type: cc.SpriteFrame,
        tooltip: "奖杯"
    })
    private imgs: cc.SpriteFrame[] = [];

    @property({
        type: cc.SpriteFrame,
        tooltip: "主角"
    })
    private zjSF: cc.SpriteFrame[] = [];


    init(data,i){
        console.log("加载成功"+i);
        console.log(data);
        if(i<3){
            this.ncTxt.string = "";
            this.jbTxt.spriteFrame = this.imgs[i];
        }else{
            this.ncTxt.string = (i+1)+"";
        }
        this.nameTxt.string = data.nickname+"";

        let av = data.avatarUrl+""
        ResourcesMgr.setAvatar(av,this.txNode);
        if (data.KVDataList[0].value !=null && data.KVDataList[0].value!=undefined) {
            let dd = JSON.parse(data.KVDataList[0].value)
            this.tianTxt.string = dd.score + "天";
            let tid = parseInt(dd.tid)
            this.zjNode.spriteFrame = this.zjSF[tid];
        }
        // if(data.KVDataList[0].value !=null && data.KVDataList[0].value!=undefined){
        //     this.tianTxt.string = data.KVDataList[0].value + "天";
        // }

        // if(data.KVDataList[1].value!=null && data.KVDataList[1].value!=undefined){
        //     let id = Number(data.KVDataList[1].value)
        //     this.zjNode.spriteFrame = this.zjSF[id];
        // }
        
    }

    

}
