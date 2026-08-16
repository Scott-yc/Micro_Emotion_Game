

import { audioConfig, PlayerMessage } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { GameDataTable, GameData_Type } from "./work/GameDataTable";
import { ManagerAD } from "./work/ManagerAD";
import { ManagerUI } from "./work/ManagerUI";
import { NetWork } from "./work/NetWork";
import { Observer } from "./work/Observer";
import { TimeTool } from "./work/TimeTool";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Win_UI extends cc.Component {


    @property({
        type: cc.Label,
        tooltip: "彩石数"
    })
    private csTxt: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "分数"
    })
    private scoreTxt: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "天数"
    })
    private tianTxt: cc.Label = null;

    @property({
        type: cc.Node,
        tooltip: "返回按钮"
    })
    private baBtn: cc.Node = null;

    @property({
        type: cc.Node,
        tooltip: "复活按钮"
    })
    private fhBtn: cc.Node = null;

    private curTianNum = 0;


    onLoad() {
    }

    onDestroy() {
    }

    onEnable() {
        AudioMgr.playAudioEffectLiu(audioConfig.lose, 1)
        if (PlayerMessage.GameZD && cc.sys.platform == cc.sys.WECHAT_GAME) {
            window['wx'].vibrateLong()
        }
        this.init();
    }

    /**初始化 */
    init() {
        PlayerMessage.playGameResurrectionNum += 1;
        // if(PlayerMessage.playGameResurrectionNum>2){
        //     PlayerMessage.playGameResurrectionNum=2
        // }
        this.curTianNum = PlayerMessage.playGameTimerNum + 1;
        this.tianTxt.string = this.curTianNum + "";
        let csNum = this.curTianNum * PlayerMessage.PlayStoreNum;
        this.csTxt.string = csNum + "";
        // let scoNum = this.curTianNum * PlayerMessage.PlayScoreNum;
        // this.scoreTxt.string = scoNum+"";
        let at = PlayerMessage.PlayScoreNum + "";
        let type = Number(PlayerMessage.playGameSkinID - 1) + "";
        let tian = PlayerMessage.playGameTimerNum + "";
        if (PlayerMessage.playGameResurrectionNum > PlayerMessage.PlayerResurrection) {
            let gameID = PlayerMessage.playGameID;
            this.fhBtn.active = false;
            this.baBtn.x = 0;
            // NetWork.setWinMesssage(gameID,this.curTianNum,(bool,res,msg)=>{
            //     if(bool){
            //     }
            // })
        } else {
            this.baBtn.x = -300;
            this.fhBtn.active = true;
        }

        // this.shangChuan(tian,type)
    }


    shangChuan(ian, ty) {
        let tian = ian;
        let tyy = ty;
        // 
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            console.log("走没")
            console.log("发送数据", "天 ", tian, "皮肤 ", tyy);
            let av = tian + "";
            let am = tyy + "";
            let now = new Date();
            let year = now.getFullYear();
            let week = TimeTool.getWeekOfYear();
            let rank_key = `rank_${year}_${week}`;
            console.log('win上传的key  ', rank_key)
            //KVDataList: [{ key: 'score', value: av, }, { key: 'tid', value: am, }],
            window['wx'].setUserCloudStorage({
                KVDataList: [{ key: rank_key, value: JSON.stringify({ score: av, tid: am }) }],
                success: res => {
                    console.log('上传玩家数据成功', res);
                    Observer.emit("musicBG")
                    Observer.emit("csShow")
                    ManagerUI.closeUI("Fight_UI");
                    ManagerUI.closeUI("Win_UI");
                    ManagerUI.openUI("Home_UI");
                },
                fail: err => {
                    console.log('上传玩家数据失败', err);
                    Observer.emit("musicBG")
                    Observer.emit("csShow")
                    ManagerUI.closeUI("Fight_UI");
                    ManagerUI.closeUI("Win_UI");
                    ManagerUI.openUI("Home_UI");
                },
                complete: () => {
                    console.log('complete');
                }
            });
        }
        else {
            Observer.emit("musicBG")
            Observer.emit("csShow")
            ManagerUI.closeUI("Fight_UI");
            ManagerUI.closeUI("Win_UI");
            ManagerUI.openUI("Home_UI");
        }
    }

    /**复活 */
    neLevelClick() {
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        //看广告复活
        ManagerAD.showIncentiveAD((msg) => {
            console.log('WIN_UI ', msg)
            Observer.emit("anginShow")
            ManagerUI.closeUI(this.node.name);
        }, (msg) => {
            console.log('WIN_UI fail ', msg)
        })
        // Observer.emit("anginShow")
        // ManagerUI.closeUI(this.node.name);
    }

    /**返回首页 */
    backHomeClick() {
        let that = this
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        let gameID = PlayerMessage.playGameID;
        // this.curTianNum = 75;//测试
        NetWork.setWinMesssage(gameID, this.curTianNum, (bool, res, msg) => {
            if (bool) {
                NetWork.getPlayMessage((bool, res, msg) => {
                    if (bool) {
                        PlayerMessage.PlayerMaxDay = Number(res.data.day);
                        // PlayerMessage.PlayerMaxDay = 0;
                        console.log('当前天  ', that.curTianNum, '  最大天数 ', PlayerMessage.PlayerMaxDay, "当前皮肤 ", PlayerMessage.playGameSkinID - 1)
                        if (that.curTianNum >= PlayerMessage.PlayerMaxDay) {
                            let typeID = Number(PlayerMessage.playGameSkinID - 1) + "";
                            console.log("-------------------")
                            that.shangChuan(that.curTianNum, typeID)
                            // Observer.emit("shangchuan",this.curTianNum,typeID)
                        } else {

                            Observer.emit("musicBG")
                            Observer.emit("csShow")
                            ManagerUI.closeUI("Fight_UI");
                            ManagerUI.closeUI("Win_UI");
                            ManagerUI.openUI("Home_UI");
                        }
                    }
                })
                // console.log("----------------")


                // ManagerUI.closeUI(this.node.name);
            }
        })
    }
}
