
import { audioConfig, GameFidhtMessage, PlayerMessage } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { GameData_Type, GameDataTable } from "./work/GameDataTable";
import { ManagerUI } from "./work/ManagerUI";
import { Message, MessageType } from "./work/Message";
import { NetWork } from "./work/NetWork";
import { Observer } from "./work/Observer";
import { ResourcesMgr } from "./work/ResourcesMgr";
import { TimeTool } from "./work/TimeTool";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Home_UI extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: "头像"
    })
    private headNode: cc.Node = null;

    @property({
        type: cc.Label,
        tooltip: "名字"
    })
    private nameTxt: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "彩石"
    })
    private CSTxt: cc.Label = null;



    @property({
        type: cc.Node,
        tooltip: "解锁未解锁"
    })
    private lockNode: cc.Node[] = [];

    @property({
        type: cc.Node,
        tooltip: "文字"
    })
    private wzMCNode: cc.Node = null;

    @property({
        type: cc.SpriteFrame,
        tooltip: "文字图片显示"
    })
    private wzMcSp: cc.SpriteFrame[] = [];

    @property({
        type: cc.Node,
    })
    private petlbArr: cc.Node[] = [];

    private pageNum = 0;

    private pfArr = [];

    private pfID = 0;

    private clickNum: number = 0;//第几个


    onLoad() {
        Observer.on("updataSkin", this.InitializationShow, this)
        Observer.on("csShow", this.csShow, this)
        Observer.on("musicBG", this.playAudioBG, this)
    }

    onEnable() {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            // console.log(wx.getOpenDataContext())
            wx.getOpenDataContext().postMessage(new Message(MessageType.FRIEND_RANK));
        }
        this.init();
        // this.shangChuan(19,5)//测试

        // wx.removeUserCloudStorage({
        //     keyList: ['maxScore'],
        //     success: res => {
        //         console.log('清除玩家数据成功', res);
        //     },
        //     fail: err => {
        //         console.log('清除玩家数据失败', err);
        //     },
        //     complete: () => {
        //         console.log('complete');
        //     }
        // });
    }

    // shangChuan(ian,ty){
    //     let tian = ian;
    //     let tyy = ty;
    //     // 
    //     if(cc.sys.platform == cc.sys.WECHAT_GAME){
    //         console.log("走没")
    //             console.log("发送数据");
    //             let av = tian+"";
    //             let am = tyy+"";
    //             wx.setUserCloudStorage({
    //                 KVDataList: [{
    //                     key: 'score',
    //                     value: av,
    //                   },{
    //                     key: 'tid',
    //                     value: am,
    //                   }],
    //                 success: res => {
    //                     console.log('上传玩家数据成功', res);
    //                     let openDataContext = wx.getOpenDataContext();
    //                     openDataContext.postMessage({
    //                         type: 'updateMaxScore',
    //                     });
    //                 },
    //                 fail: err => {
    //                     console.log('上传玩家数据失败', err);
    //                 },
    //                 complete: () => {
    //                     console.log('complete');
    //                 }
    //             });
    //     }
    // }


    onDestroy() {
        Observer.off("updataSkin")
        Observer.off("csShow")
    }

    update(dt) {
    }

    //初始化
    private init() {
        this.pageNum = 0;
        this.petlbArr[0].parent.active = false;
        let name = GameDataTable.getDataType(GameData_Type.playerName);
        let add = GameDataTable.getDataType(GameData_Type.playerAddress);
        this.nameTxt.string = name + "";
        ResourcesMgr.loadImgByUrl(this.headNode, add, "png")
        this.InitializationShow();
        //个人信息
        NetWork.getPlayMessage((bool, res, msg) => {
            if (bool) {
                this.CSTxt.string = res.data.money + "";
                PlayerMessage.PlayerMaxDay = Number(res.data.day);
                let skin = res.data.max_skin || 1;
                console.log('最大天数  ', PlayerMessage.PlayerMaxDay)
                if (PlayerMessage.PlayerMaxDay > 0) {
                    this.shangChuan(PlayerMessage.PlayerMaxDay, skin - 1)
                }
            }
        })
        NetWork.getZiDanMesssage((bool, res, msg) => {
            if (bool) {
                PlayerMessage.PlayerResurrection = res.data.revive_frequency
                PlayerMessage.PlayBulletHurt = res.data.hurt;
                PlayerMessage.PlayBulletRange = res.data.range;
                PlayerMessage.PlayMonster = res.data.monster;
                PlayerMessage.PlayVideoScore = res.data.advertisement_obtain_points;
                PlayerMessage.PlayStoreNum = res.data.survival_spar;
                PlayerMessage.PlayScoreNum = res.data.survival_points;

                GameFidhtMessage.Fight_Play_Blood = res.data.blood;
                GameFidhtMessage.Fight_Play_Move = res.data.move;
                GameFidhtMessage.Fight_Play_Invincible = res.data.invincible;

                GameFidhtMessage.Fight_Enemy_Small_Time = res.data.ordinary_monster_birth_time;
                GameFidhtMessage.Fight_Enemy_Middle_Time = res.data.elite_monster_birth_time;
                GameFidhtMessage.Fight_Enemy_Big_Time = res.data.boss_monster_birth_time;

                GameFidhtMessage.Fight_Enemy_Small_Monster = res.data.monster;
                GameFidhtMessage.Fight_Enemy_Middle_Monster = res.data.elite_monster;
                GameFidhtMessage.Fight_Enemy_Big_Monster = res.data.monster_boss;

                GameFidhtMessage.Fight_Enemy_Elite6_Stop_Time = res.data.stay_time;
                GameFidhtMessage.Fight_Enemy_Elite6_Egg_Time = res.data.shell_stay_time;
                GameFidhtMessage.Fight_Enemy_Elite6_Interval_Time = res.data.interval_time;
                GameFidhtMessage.Fight_Enemy_Elite9_Reduce_Time = res.data.speed_reduction_time;
                // console.log(GameFidhtMessage.Fight_Enemy_Small_Monster)
                // console.log("---------------------------------------------")


                // console.log("主角血量：",GameFidhtMessage.Fight_Play_Blood)
                // console.log("主角移速：",GameFidhtMessage.Fight_Play_Move)
                // console.log("主角无敌时间：",GameFidhtMessage.Fight_Play_Invincible)
                // console.log("普通怪物出生时间间隔：",GameFidhtMessage.Fight_Enemy_Small_Time)
                // console.log("精英怪物出生时间间隔：",GameFidhtMessage.Fight_Enemy_Middle_Time)
                // console.log("boss怪物出生时间间隔：",GameFidhtMessage.Fight_Enemy_Big_Time)
                // console.log("普通怪物属性：",GameFidhtMessage.Fight_Enemy_Small_Monster)
                // console.log("精英怪物属性：",GameFidhtMessage.Fight_Enemy_Middle_Monster)
                // console.log("boss怪物属性：",GameFidhtMessage.Fight_Enemy_Big_Monster)
                // console.log("机器人发动技能停留时间",GameFidhtMessage.Fight_Enemy_Elite6_Stop_Time)
                // console.log("机器人下的蛋停留时间",GameFidhtMessage.Fight_Enemy_Elite6_Egg_Time)
                // console.log("机器人发动技能间隔时间",GameFidhtMessage.Fight_Enemy_Elite6_Interval_Time)
                // console.log("恐龙技能玩家射速降低时间：",GameFidhtMessage.Fight_Enemy_Elite9_Reduce_Time)
            }
        })


    }


    playAudioBG() {
        cc.audioEngine.stopAllEffects();
        AudioMgr.playBGMusic(audioConfig.BGMusic)

    }

    //数据初始化
    InitializationShow() {
        NetWork.getPiFuMesssage((bool, res, msg) => {
            if (bool) {
                this.pfArr = res.data.skin;
                let ay = Number(res.data.default_skin) - 1
                this.wzMCNode.getComponent(cc.Sprite).spriteFrame = this.wzMcSp[ay]
                console.log('当前使用皮肤  ', ay)
                PlayerMessage.playDefault = ay;
                this.clickNum = ay;
                for (let a = 0; a < 10; a++) {
                    if (PlayerMessage.playDefault == a) {
                        this.petlbArr[a].x = 0;
                    } else {
                        this.petlbArr[a].x = 350;
                    }
                }
                this.xzBtnClick(this.clickNum)
                this.petlbArr[0].parent.active = true;

            }
        })
    }


    csShow() {
        // console.log("===========================")
        //个人信息
        NetWork.getPlayMessage((bool, res, msg) => {
            if (bool) {
                this.CSTxt.string = res.data.money + "";
                PlayerMessage.playGameStoreNum = res.data.money;
            }
        })
    }

    //三种按钮选择
    xzBtnClick(pfId) {
        if (PlayerMessage.playDefault == pfId) {
            this.lockNode[0].active = true;
            this.lockNode[1].active = false;
            this.lockNode[2].active = false;
        } else {
            for (let a = 0; a < this.pfArr.length; a++) {
                if ((Number(this.pfArr[a]) - 1) == pfId) {
                    this.lockNode[0].active = false;
                    this.lockNode[1].active = true;
                    this.lockNode[2].active = false;
                    return
                }

            }
            this.lockNode[0].active = false;
            this.lockNode[1].active = false;
            this.lockNode[2].active = true;
        }

    }


    //皮肤使用
    skinUseShow() {
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        let skinId = this.pfID;
        console.log("当前皮肤ID：" + skinId)
        NetWork.getYingYongMesssage(skinId, (bool, res, msg) => {
            if (bool) {
                this.InitializationShow();

            }
        })
    }

    /**商城 */
    private shopClick() {
        console.log("商城");
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        ManagerUI.openUI("Shop_UI");

    }

    /**排行榜 */
    private rankClick() {
        console.log("排行榜");
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        ManagerUI.openUI("Rank_UI");
    }

    /**设置 */
    private settClick() {
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        console.log("设置");
        PlayerMessage.PlaySetUI = false;
        ManagerUI.openUI("Set_UI");
    }

    /**开始游戏 */
    private startGameClick() {
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        console.log("开始游戏");
        NetWork.getYouXiStartMesssage((bool, res, msg) => {
            if (bool) {
                PlayerMessage.playGameID = res.data;
                ManagerUI.openUI("Fight_UI");
            }
        })
        // ManagerUI.openUI("Fight_UI");
    }

    public leftBtnClick() {
        AudioMgr.playAudioEffect(audioConfig.btnClick);
        this.leftMove1(this.clickNum);
        this.clickNum -= 1;
        if (this.clickNum <= -1) {
            this.clickNum = 9;
        }
        this.petlbArr[this.clickNum].x = -350;
        this.leftMove2(this.clickNum);
    }

    public rightBtnClick() {
        AudioMgr.playAudioEffect(audioConfig.btnClick);
        this.rightMove1(this.clickNum);
        this.clickNum += 1;
        if (this.clickNum >= 10) {
            this.clickNum = 0;
        }
        this.petlbArr[this.clickNum].x = 350;
        this.rightMove2(this.clickNum);
    }

    private leftMove1(num: number) {
        cc.tween(this.petlbArr[num])
            .to(0.3, { x: 350 })
            .delay(0.1)
            .call(() => {
            })
            .start()
    }

    private leftMove2(num: number) {
        cc.tween(this.petlbArr[num])
            .to(0.3, { x: 0 })
            .delay(0.1)
            .call(() => {
                this.pfID = num + 1;
                this.wzMCNode.getComponent(cc.Sprite).spriteFrame = this.wzMcSp[num]
                this.xzBtnClick(num)
            })
            .start()
    }

    private rightMove1(num: number) {
        cc.tween(this.petlbArr[num])
            .to(0.3, { x: -350 })
            .delay(0.1)
            .call(() => {
            })
            .start()
    }

    private rightMove2(num: number) {
        cc.tween(this.petlbArr[num])
            .to(0.3, { x: 0 })
            .delay(0.1)
            .call(() => {
                this.pfID = num + 1;
                this.wzMCNode.getComponent(cc.Sprite).spriteFrame = this.wzMcSp[num]
                this.xzBtnClick(num)
            })
            .start()
    }


    shangChuan(ian, ty) {
        let tian = ian;
        let tyy = ty;
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            console.log("走没")
            console.log("发送数据", "天 ", tian, "皮肤 ", tyy);
            let ak = String(tyy);
            let av = String(tian);
            let now = new Date();
            let year = now.getFullYear();
            let week = TimeTool.getWeekOfYear();
            let rank_key = `rank_${year}_${week}`;
            console.log('上传的key  ',rank_key)
            // KVDataList: [{ key: 'score', value: av }, { key: 'tid', value: ak }],
            wx.setUserCloudStorage({
                KVDataList: [{key: rank_key, value: JSON.stringify({score: av, tid: ak })}],
                success: res => {
                    console.log('上传玩家数据成功', res);
                    // let openDataContext = wx.getOpenDataContext();
                    // openDataContext.postMessage({
                    //     type: 'updateMaxScore',
                    // });
                },
                fail: err => {
                    console.log('上传玩家数据失败', err);
                },
                complete: () => {
                    console.log('complete');
                }
            });
        }
    }


}
