
import RankItem from "./RankItem";
import { dateToDateString, getWeekOfYear } from "./Until";

const { ccclass, property } = cc._decorator;

export enum MessageType {
    POST_SCORE,
    FRIEND_CIRCLE,
    FRIEND_RANK,
    CLEAR,

}


export interface Message {
    type: MessageType;
    payload: any;
}

@ccclass
export default class main extends cc.Component {

    friData = [];

    @property(cc.Node) rankNode: cc.Node = null;
    @property(cc.Node) rankContent: cc.Node = null;
    @property(cc.Prefab) rankPre: cc.Prefab = null;

    protected onLoad() {
        cc.macro.ENABLE_TRANSPARENT_CANVAS = true;
        cc.director.setClearColor(new cc.Color(255, 255, 255, 0));
        console.log("加载子域成功。。。。。。。");
        this.registerMessage();

    }

    registerMessage() {
        // console.log('reg');
        console.log('----------------------------------------------');
        this.rankNode.active = false;
        let that = this

        wx.onMessage(async (msg: Message) => {
            switch (msg.type) {
                case MessageType.FRIEND_RANK:
                    that.wxGetFriendCloud();
                    console.log('好友数据域数据1');
                    break;
                // case MessageType.FRIEND_CIRCLE:
                //     that.wxGetFriendCloud2();
                //     console.log('好友数据域数据2');
                //     break;
                case MessageType.CLEAR:
                    that.rankNode.active = false;
                    // console.log('guanbi');
                    break;
            }
        });
    }

    showRank() {
        console.log(this.friData.length);
        console.log(this.friData);
        this.friData.sort((a: any, b: any) => {
            let aD = JSON.parse(a.KVDataList[0].value)
            let bD = JSON.parse(b.KVDataList[0].value)
            return parseInt(bD.score) - parseInt(aD.score);
        });

        // this.friData.sort(function(a, b) {
        //     if(b.KVDataList[0].value == null || a.KVDataList[0].value == null){
        //         return 0
        //     }
        //     return (b.KVDataList[0].value)-(a.KVDataList[0].value);

        // });

        console.log('kkkkkkkkkkkkkkkkkkkk');
        let contents = this.rankContent;
        if (contents.childrenCount > 0) {
            contents.removeAllChildren();
        }
        for (let i = 0; i < this.friData.length; i++) {
            console.log('开始实例化' + i);
            let node = cc.instantiate(this.rankPre);
            node.getComponent(RankItem).init(this.friData[i], i);
            node.setParent(this.rankContent);
            // contents.addChild(node);
        }
        console.log('nnnnnnnnnnnnnnnnnnnn');
    }

    showRank2() {
        console.log(this.friData.length);
        console.log(this.friData);
        console.log(this.friData[0].KVDataList[0].value);
        this.friData.sort((a, b) => (b.KVDataList[0].value) - (a.KVDataList[0].value));


    }

    private wxGetFriendCloud() {
        let that = this;
        this.friData = [];
        let now = new Date();
        let year = now.getFullYear();
        let week = getWeekOfYear();
        let rank_key = `rank_${year}_${week}`;
        console.log('子域获取的key  ', rank_key)
        wx.getFriendCloudStorage({
            keyList: [rank_key], // 你要获取的、托管在微信后台都key
            success: (res) => {
                that.friData = [];
                console.log(res.data)
                for (let a = 0; a < res.data.length; a++) {
                    if (res.data[a].KVDataList.length <= 0) {
                        continue;
                    }
                    that.friData.push(res.data[a]);
                }
                that.rankNode.active = true;
                that.showRank();
            }
        });
    }

    private wxGetFriendCloud2() {
        let that = this;
        this.friData = [];
        wx.getFriendCloudStorage({
            keyList: ['score', 'tid'], // 你要获取的、托管在微信后台都key
            success: res => {
                that.friData = [];
                console.log(res.data)
                for (let a = 0; a < res.data.length; a++) {
                    if (res.data[a].KVDataList.length <= 0) {
                        continue;
                    }
                    that.friData.push(res.data[a]);
                }
                that.rankNode.active = true;
                that.showRank2();
            }
        });
    }

}

