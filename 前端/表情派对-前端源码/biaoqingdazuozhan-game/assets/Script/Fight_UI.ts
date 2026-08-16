
import { audioConfig, GameFidhtMessage, PlayerMessage } from "./config/Config";
import Tip_UI from "./Tip_UI";
import { AudioMgr } from "./work/AudioMgr";
import { GameCamera } from "./work/GameCamera";
import { ManagerUI } from "./work/ManagerUI";
import { NetWork } from "./work/NetWork";
import { Observer } from "./work/Observer";


const { ccclass, property } = cc._decorator;

/**
 * 战斗页  //用cc.SystemEvent监听键盘上下左右按键，用于移动人物，人物移动后刷新摄像机位置updatePosition让人物居中。
 * @author chenkai 2022.8.29
 */
@ccclass
export default class Fight_UI extends cc.Component {

    @property({ type: cc.Node, tooltip: "地图节点" })
    mapNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: "怪物容器" })
    enemyNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: "蛋容器" })
    danNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: "人物" })
    roleNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: "人物Mc" })
    playRoleNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: "人物血" })
    roleHPNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: "视口" })
    viewPort: cc.Node = null;
    @property({ type: cc.Node, tooltip: "左圆" })
    zuoyuanNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: "右圆" })
    youyuanNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: "左圆操作" })
    zuoyuanCZNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: "右圆操作" })
    youyuanCZNode: cc.Node = null;
    @property({ type: cc.Prefab, tooltip: "子弹" })
    bulletPre: cc.Prefab = null;
    @property({ type: cc.Node, tooltip: "子弹容器" })
    betNode: cc.Node = null;
    @property({ type: cc.Prefab, tooltip: "敌人" })
    enemyPre: cc.Prefab[] = [];
    @property({ type: cc.Prefab, tooltip: "boss" })
    bossPre: cc.Prefab[] = [];
    @property({ type: cc.Prefab, tooltip: "boss" })
    bossDaPre: cc.Prefab = null;
    @property({ type: cc.Label, tooltip: "金币" })
    jbTxt: cc.Label = null;
    @property({ type: cc.Label, tooltip: "血量" })
    hpTxt: cc.Label = null;
    @property({ type: cc.Label, tooltip: "子弹强化等级" })
    btqhTxt: cc.Label = null;
    @property({ type: cc.Label, tooltip: "子弹范围等级" })
    zdfwTxt: cc.Label = null;
    @property({ type: cc.SpriteFrame, tooltip: "主角皮肤" })
    zhuJueSkin: cc.SpriteFrame[] = [];
    @property({ type: cc.Label, tooltip: "天数" })
    tianTxt: cc.Label = null;
    @property({ type: cc.Node, tooltip: "黑圆" })
    heiYuan: cc.Node[] = [];
    @property({ type: cc.Node, tooltip: "飘字" })
    piaoNode: cc.Node = null;
    @property({ type: cc.Label, tooltip: "字" })
    pziNode: cc.Label = null;
    @property({ type: cc.Node, tooltip: "提示" })
    tsNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: "减速" })
    jsNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: "音波" })
    ybNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "操作" })
    czNode: cc.Node = null;

    private gameCamera: GameCamera;/**摄像机 */

    private keyCache = {};/**按键缓存 */

    private roleSpeed: number = 8;/**人物移动速度 */

    private BulletPool//子弹对象池

    private EnemyPool//敌人对象池

    private zuoPoint;
    private youPoint;
    private zuoadir;
    private youadir;

    private enemyArr = [];//敌人容器

    private enemyEliteArr = [];//精英容器

    private enemyBoosArr = [];//精英容器

    private lsHPArr = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
    private subHP = 2;//子弹强度
    private bullteStrength = 1;//子弹初始强度
    private bullteScope = 1;//子弹初始宽度
    private bullteRate = 5;//子弹初始速度

    private InvincibleBool = false;//无敌状态
    private InvincibleTime = 0;//无敌时间

    // private curGold = 0;//初始玩家化金币
    private curZongHP = 5;//初始玩家总生命值
    private curHP = 5;//初始玩家化生命值

    private tzClickBool = false;//按钮连点控制

    private sxTimeArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];//子弹范围初始化控制

    private youtgAngle;//子弹初始角度

    private GameStart = false;//false正常游戏  true暂停游戏

    private gameTimer = 0;//游戏进行时长/秒
    private gameTimerBool = true;//控制游戏计时

    private gamePlayHp = 90;

    private abc = 0;//砸蛋音效频率

    private yiDongSpeed = false;

    private enemyFrequency = 2;//普通怪物出现时间 秒

    private EliteFrequency = 10;//普通怪物出现时间 秒

    private BossFrequency = 3;//普通怪物出现时间 天

    private smallSpeed = 70;//普通敌机移动速度
    private middleSpeed = 70;//精英敌机移动速度
    private bigSpeed = 70;//BOSS敌机移动速度

    private tsMiao = 30

    private zdAu = 10;

    private batMcNode: cc.Node

    private yxlv = 0;

    // private curGold = 0;//当前金币

    onLoad() {
        console.log("Fight_UI")
        Observer.on("eneShow", this.eneShow, this)
        Observer.on("anginShow", this.againClick, this)
        Observer.on("gameStop", this.gameStop, this)
        Observer.on("gameScore", (id)=> {
            this.updataUser(id);
        }, this)

        Observer.on("bianbianShow", this.bianbianShowMessage, this)
        Observer.on("yinboShow", this.yinboShowMessage, this)
        Observer.on("danShow", this.danShowMessage, this)
        Observer.on("upScore", function (id) {
            this.updataPiaoZiShow(id);
        }, this)
        Observer.on("upEliteScore", function (id) {
            this.updataPiaoZiShow2(id);
        }, this)
        Observer.on("bossDaScore", function (id) {
            this.updataPiaoZiShow3(id);
        }, this)
        Observer.on("upEliteScore_0", function (id) {
            this.upEliteScore_0(id);
        }, this)



        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.BulletPool = new cc.NodePool();
        this.EnemyPool = new cc.NodePool();

        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        // this.zuoyuanCZNode.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this)
        // this.zuoyuanCZNode.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this)
        // this.zuoyuanCZNode.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this)
        // this.zuoyuanCZNode.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd,this)

        this.czNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.czNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.czNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.czNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)

        this.youyuanCZNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStartYou, this)
        this.youyuanCZNode.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveYou, this)
        this.youyuanCZNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEndYou, this)
        this.youyuanCZNode.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEndYou, this)
    }

    protected onDisable(): void {
        this.unscheduleAllCallbacks()
    }

    onEnable() {
        this.tianTxt.string = "第1天";
        AudioMgr.stopBgMusic();
        AudioMgr.playBGMusic(audioConfig.ZDSD)
        if (this.batMcNode != null && this.batMcNode != undefined) {
            this.betNode.removeChild(this.batMcNode)
        }
        // this.updateEnemy();
        this.fightShow();

        this.BulletPool.clear()
        this.EnemyPool.clear()
        this.batMcNode = new cc.Node();
        this.betNode.addChild(this.batMcNode)
        // console.log(this.betNode.childrenCount)
        // console.log("---------------------------------------------")
        // if(this.betNode.childrenCount>0){
        //     this.betNode.removeAllChildren();
        // }
        if (this.enemyNode.childrenCount > 0) {
            this.enemyNode.removeAllChildren();
        }
        // console.log(this.danNode)
        if (this.danNode.childrenCount > 0) {
            this.danNode.removeAllChildren();
        }
        this.playRoleNode.getComponent(cc.Sprite).spriteFrame = null;

        this.roleNode.setPosition(cc.v2(0, 0))
        this.zuoPoint = this.zuoyuanNode.getPosition();
        this.youPoint = this.youyuanNode.getPosition();
        this.gameCamera = new GameCamera(this.viewPort, this.mapNode, this.roleNode);
        this.enemyArr = [];
        this.enemyEliteArr = [];
        this.enemyBoosArr = [];
        this.bullteScope = 1;
        this.tsMiao = 30
        this.abc = 0;
        this.zdAu = 10;
        this.yxlv = 0.2;
        this.bullteRate = 5
        this.btqhTxt.string = "1";
        this.zdfwTxt.string = "1";
        this.InvincibleBool = false;
        this.yiDongSpeed = false;
        this.jsNode.active = false;
        this.ybNode.active = false;
        this.heiYuan[0].active = false;
        this.heiYuan[1].active = false;
        this.heiYuan[2].active = false;
        this.heiYuan[3].active = false;
        this.piaoNode.active = false;
        this.tsNode.active = false;
        this.tzClickBool = false;
        PlayerMessage.playStop = false;
        // this.curHP = this.curZongHP;
        PlayerMessage.playGameScoreNum = 0;
        this.jbTxt.string = PlayerMessage.playGameScoreNum + "";
        this.hpTxt.string = this.curHP + "";
        this.youtgAngle = 0;
        this.gameTimer = 0;
        this.bullteStrength = 1;
        this.GameStart = true;
        this.gameTimerBool = true;
        this.sxTimeArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        PlayerMessage.playGameResurrectionNum = 0;
        // console.log("子弹伤害：" + PlayerMessage.PlayBulletCurHurt)

        // this.updateEnemy();
        // this.updateEliteEnemy();
        // this.updateBoosEnemy();

        //个人信息
        NetWork.getPlayMessage((bool, res, msg) => {
            if (bool) {
                this.subHP = PlayerMessage.PlayBulletHurt[this.bullteStrength - 1].hurt
                console.log(PlayerMessage.PlayBulletHurt)
                PlayerMessage.PlayBulletCurHurt = this.subHP;
                PlayerMessage.playGameSkinID = res.data.default_skin;
                let skinID = PlayerMessage.playGameSkinID - 1;
                // let skinID = 10;//测试
                console.log("skinID:" + skinID)
                this.playRoleNode.getComponent(cc.Sprite).spriteFrame = this.zhuJueSkin[skinID];
                this.roleHPNode.width = this.gamePlayHp;
                this.scoreBoxShow(PlayerMessage.playGameScoreNum)
                if (skinID == 1) {
                    this.zdAu = 90;
                }
                if (skinID == 3) {
                    this.zdAu = 60;
                }
                // if(skinID == 5){
                //     this.zdAu = 130;
                // }

                this.schedule(this.updateEnemy, this.enemyFrequency)
                this.schedule(this.updateEliteEnemy, this.EliteFrequency)
                this.schedule(this.updateGameTime, 1)
                setTimeout(() => {
                    this.GameStart = false;
                    this.soundBiuShow(skinID)
                }, 500);
            }
        })

        // if(cc.sys.platform == cc.sys.WECHAT_GAME){
        //     wx.onShow(()=>{
        //         AudioMgr.playBGMusic(audioConfig.ZDSD)
        //     })
        // }
    }

    fightShow() {
        //配置信息更新
        this.roleSpeed = GameFidhtMessage.Fight_Play_Move;//主角移动速度
        this.curZongHP = GameFidhtMessage.Fight_Play_Blood;//主角生命
        this.curHP = GameFidhtMessage.Fight_Play_Blood;//主角生命
        this.InvincibleTime = GameFidhtMessage.Fight_Play_Invincible;//主角无敌时间
        this.enemyFrequency = GameFidhtMessage.Fight_Enemy_Small_Time;//普通怪物出现时间
        this.EliteFrequency = GameFidhtMessage.Fight_Enemy_Middle_Time;//精英怪物出现时间
        this.BossFrequency = GameFidhtMessage.Fight_Enemy_Big_Time;//Boos怪物出现时间
        this.smallSpeed = GameFidhtMessage.Fight_Enemy_Small_Monster[0].moving_speed;//普通怪物移速
        this.middleSpeed = GameFidhtMessage.Fight_Enemy_Middle_Monster[0].moving_speed;//普通怪物移速
        this.bigSpeed = GameFidhtMessage.Fight_Enemy_Big_Monster[0].moving_speed;//普通怪物移速
    }

    update(dt) {
        if (this.GameStart) {
            return
        }

        let len = this.zuoyuanNode.position.mag();
        let len2 = this.youyuanNode.position.mag();
        let maxLen = 200 / 2;
        let ratio = len / maxLen;
        let ratio2 = len2 / maxLen;

        // restrict joyStickBtn inside the joyStickPanel
        if (ratio > 1) {
            this.zuoyuanNode.setPosition(this.zuoyuanNode.position.div(ratio));
        }
        if (ratio2 > 1) {
            this.youyuanNode.setPosition(this.youyuanNode.position.div(ratio2));
        }
        if (!this.yiDongSpeed) {
            this.updateRoleMove(ratio);
        } else {
            let jh = ratio - (ratio * 0.5);
            this.updateRoleMove(jh);
        }

        this.updateCamera();
        // this.updateBullet();
        if (this.abc % 2 == 0) {
            this.spore(this.youtgAngle)
        }
        this.updateEnemyCoordinate(dt);
        PlayerMessage.playRoleWZX = this.roleNode.x;
        PlayerMessage.playRoleWZY = this.roleNode.y;

        this.abc++;
        let skinID = PlayerMessage.playGameSkinID - 1;

        if (this.abc % this.zdAu == 0) {
            // AudioMgr.playAudioEffect2(audioConfig.biu)
            this.soundBiuShow(skinID)
        }

    }

    /**刷新人物移动 */
    private updateRoleMove(ratio) {
        if (this.zuoadir != null && this.zuoadir != undefined) {
            let dis = this.zuoadir.mul(this.roleSpeed * ratio);
            this.roleNode.setPosition(this.roleNode.position.add(dis))
        }
        //边缘检测
        if (this.roleNode.x + this.roleNode.width / 2 > this.mapNode.width / 2) {
            this.roleNode.x = this.mapNode.width / 2 - this.roleNode.width / 2;
            // console.log("人物超过地图右边缘");
        } else if (this.roleNode.x - this.roleNode.width / 2 < -this.mapNode.width / 2) {
            this.roleNode.x = -this.mapNode.width / 2 + this.roleNode.width / 2;
            // console.log("人物超过地图左边缘");
        }
        if (this.roleNode.y + this.roleNode.height / 2 > this.mapNode.height / 2) {
            this.roleNode.y = this.mapNode.height / 2 - this.roleNode.height / 2;
            // console.log("人物超过地图上边缘");
        } else if (this.roleNode.y - this.roleNode.height / 2 < -this.mapNode.height / 2) {
            this.roleNode.y = -this.mapNode.height / 2 + this.roleNode.height / 2;
            // console.log("人物超过地图下边缘");
        }

    }

    /**子弹刷新 */
    private updateBullet1(angle: number) {
        let uiy = this.roleNode.getPosition();
        this.sxTimeArr[0]++
        if (this.sxTimeArr[0] == this.bullteRate) {
            let zidan = null;
            if (this.BulletPool.size > 0) {
                zidan = this.BulletPool.get();
            } else {
                zidan = cc.instantiate(this.bulletPre);
            }
            zidan.parent = this.batMcNode;
            let view = zidan.getComponent("Bullet");
            view.angleShow(angle);
            view.fly(uiy, this.youPoint, angle, 3);
            this.sxTimeArr[0] = 0;
        }
    }
    private updateBullet2(angle: number) {
        let uiy = this.roleNode.getPosition();
        this.sxTimeArr[1]++
        if (this.sxTimeArr[1] == this.bullteRate) {
            let zidan = null;
            if (this.BulletPool.size > 0) {
                zidan = this.BulletPool.get();
            } else {
                zidan = cc.instantiate(this.bulletPre);
            }
            zidan.parent = this.batMcNode;
            let view = zidan.getComponent("Bullet");
            view.angleShow(angle);
            view.fly(uiy, this.youPoint, angle, 3);
            this.sxTimeArr[1] = 0;
        }
    }
    private updateBullet3(angle: number) {
        let uiy = this.roleNode.getPosition();
        this.sxTimeArr[2]++
        if (this.sxTimeArr[2] == this.bullteRate) {
            let zidan = null;
            if (this.BulletPool.size > 0) {
                zidan = this.BulletPool.get();
            } else {
                zidan = cc.instantiate(this.bulletPre);
            }
            zidan.parent = this.batMcNode;
            let view = zidan.getComponent("Bullet");
            view.angleShow(angle);
            view.fly(uiy, this.youPoint, angle, 3);
            this.sxTimeArr[2] = 0;
        }
    }
    private updateBullet4(angle: number) {
        let uiy = this.roleNode.getPosition();
        this.sxTimeArr[3]++
        if (this.sxTimeArr[3] == this.bullteRate) {
            let zidan = null;
            if (this.BulletPool.size > 0) {
                zidan = this.BulletPool.get();
            } else {
                zidan = cc.instantiate(this.bulletPre);
            }
            zidan.parent = this.batMcNode;
            let view = zidan.getComponent("Bullet");
            view.angleShow(angle);
            view.fly(uiy, this.youPoint, angle, 3);
            this.sxTimeArr[3] = 0;
        }
    }
    private updateBullet5(angle: number) {
        let uiy = this.roleNode.getPosition();
        this.sxTimeArr[4]++
        if (this.sxTimeArr[4] == this.bullteRate) {
            let zidan = null;
            if (this.BulletPool.size > 0) {
                zidan = this.BulletPool.get();
            } else {
                zidan = cc.instantiate(this.bulletPre);
            }
            zidan.parent = this.batMcNode;
            let view = zidan.getComponent("Bullet");
            view.angleShow(angle);
            view.fly(uiy, this.youPoint, angle, 3);
            this.sxTimeArr[4] = 0;
        }
    }
    private updateBullet6(angle: number) {
        let uiy = this.roleNode.getPosition();
        this.sxTimeArr[5]++
        if (this.sxTimeArr[5] == this.bullteRate) {
            let zidan = null;
            if (this.BulletPool.size > 0) {
                zidan = this.BulletPool.get();
            } else {
                zidan = cc.instantiate(this.bulletPre);
            }
            zidan.parent = this.batMcNode;
            let view = zidan.getComponent("Bullet");
            view.angleShow(angle);
            view.fly(uiy, this.youPoint, angle, 3);
            this.sxTimeArr[5] = 0;
        }
    }
    private updateBullet7(angle: number) {
        let uiy = this.roleNode.getPosition();
        this.sxTimeArr[6]++
        if (this.sxTimeArr[6] == this.bullteRate) {
            let zidan = null;
            if (this.BulletPool.size > 0) {
                zidan = this.BulletPool.get();
            } else {
                zidan = cc.instantiate(this.bulletPre);
            }
            zidan.parent = this.batMcNode;
            let view = zidan.getComponent("Bullet");
            view.angleShow(angle);
            view.fly(uiy, this.youPoint, angle, 3);
            this.sxTimeArr[6] = 0;
        }
    }

    /**子弹刷新 */
    private au = 0;
    private updateBullet() {
        this.au++
        if (this.au == this.bullteRate) {
            let zidan = null;
            if (this.BulletPool.size > 0) {
                zidan = this.BulletPool.get();
            } else {
                zidan = cc.instantiate(this.bulletPre);
            }
            zidan.parent = this.batMcNode;
            let view = zidan.getComponent("Bullet");
            view.fly(this.youPoint, this.youtgAngle, 3);
            this.au = 0;
        }
    }

    /**敌机刷新 */
    private updateEnemy() {
        let enemy = null;
        if (this.EnemyPool.size > 0) {
            enemy = this.EnemyPool.get();
        } else {
            let ad = Math.floor(Math.random() * 10);
            // ad = 0 //测试
            enemy = cc.instantiate(this.enemyPre[ad]);
            enemy.type = GameFidhtMessage.Fight_Enemy_Small_Monster[ad].id;
            // enemy.hp = this.lsHPArr[ad];
            // enemy.hp = Number(GameFidhtMessage.Fight_Enemy_Small_Money[ad].blood) *PlayerMessage.playGameTimerNum;
            let blood = Number(GameFidhtMessage.Fight_Enemy_Small_Monster[ad].blood);
            enemy.hp = (1 + (PlayerMessage.playGameTimerNum * 0.1)) * blood
            this.subHP = PlayerMessage.PlayBulletCurHurt;
            enemy.subhp = this.subHP;
            let playPos = cc.v2(this.roleNode.getPosition())
            let view = enemy.getComponent('Enemy');
            view.sethp(enemy.hp, enemy.subhp, playPos)
        }
        this.enemyNode.addChild(enemy);
        this.enemyArr.push(enemy)
        // console.log(enemy)
        this.moveStart = true;
    }

    /**精英刷新 */
    private jyID = 100
    private updateEliteEnemy() {
        let enemy = null;
        if (this.EnemyPool.size > 0) {
            enemy = this.EnemyPool.get();
        } else {
            let ad = Math.floor(Math.random() * 10);
            // ad = 3 //测试
            enemy = cc.instantiate(this.bossPre[ad]);
            enemy.type = this.jyID + ad;
            // enemy.hp = this.lsHPArr[ad];
            // enemy.hp = Number(GameFidhtMessage.Fight_Enemy_Middle_Monster[ad].blood);
            let blood = Number(GameFidhtMessage.Fight_Enemy_Middle_Monster[ad].blood);
            enemy.hp = (1 + (PlayerMessage.playGameTimerNum * 0.1)) * blood;
            this.subHP = PlayerMessage.PlayBulletCurHurt;
            enemy.subhp = this.subHP;
            let playPos = cc.v2(this.roleNode.getPosition())
            let boos = "Boss" + ad;
            let view = enemy.getComponent(boos);
            view.sethp(enemy.hp, enemy.subhp, playPos);
        }
        this.enemyNode.addChild(enemy);
        this.enemyEliteArr.push(enemy);
        // console.log(enemy)
        this.moveStart = true;
    }

    /**Boss刷新 */
    private boosID = 10000
    private updateBoosEnemy() {
        let enemy = null;
        if (this.EnemyPool.size > 0) {
            enemy = this.EnemyPool.get();
        } else {
            let ad = Math.floor(Math.random() * 10);
            enemy = cc.instantiate(this.bossDaPre);
            enemy.type = this.boosID + ad;
            // enemy.hp = Number(GameFidhtMessage.Fight_Enemy_Big_Monster[ad].blood);
            let blood = Number(GameFidhtMessage.Fight_Enemy_Big_Monster[ad].blood);
            enemy.hp = (1 + (PlayerMessage.playGameTimerNum * 0.1)) * blood;
            this.subHP = PlayerMessage.PlayBulletCurHurt;
            enemy.subhp = this.subHP;
            let playPos = cc.v2(this.roleNode.getPosition())
            let view = enemy.getComponent("BossDa");
            view.setBooshp(enemy.hp, enemy.subhp, playPos, ad)
        }
        this.enemyNode.addChild(enemy);
        this.enemyBoosArr.push(enemy)
        // console.log(enemy)
        this.moveStart = true;
    }

    /**Boss属性 */
    private boosAttribute(id: any, view: any) {
        switch (id) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
            case 8:
                break;
            case 9:
                break;
            case 10:
                break;
            default:
                break;
        }
    }

    //更新摄像机坐标
    private updateCamera() {
        this.gameCamera.updatePosition();
    }

    //更新敌机坐标
    private moveStart = false;
    private jsNum = 0.2;
    private updateEnemyCoordinate(dt) {
        if (this.moveStart) {
            let direction
            for (let a = 0; a < this.enemyArr.length; a++) {
                if (this.enemyArr[a].type == 500) {
                    let positionInParent = this.enemyNode.convertToNodeSpaceAR(this.enemyArr[a].getPosition());
                    let ay = this.roleNode.position;
                    ay.x -= 720;
                    ay.y -= 250;
                    direction = positionInParent.sub(ay);
                } else {
                    direction = this.enemyArr[a].position.sub(this.roleNode.position);
                }
                // let direction = this.enemyArr[a].position.sub(this.roleNode.position);
                let distance = direction.mag(); // 计算距离
                if (distance > 95) {
                    direction = direction.normalize(); // 标准化方向向量
                    // 根据距离调整速度（可选）
                    let moveSpeed = this.smallSpeed; // 或者根据距离动态调整速度
                    this.enemyArr[a].x -= direction.x * moveSpeed * dt; // 更新x坐标
                    this.enemyArr[a].y -= direction.y * moveSpeed * dt; // 更新y坐标
                }
            }
            // 计算追击者和被追目标之间的向量差
            for (let a = 0; a < this.enemyEliteArr.length; a++) {
                if (this.enemyEliteArr[a].xiadan && this.enemyEliteArr[a].type == (this.jyID + 6)) {
                    continue;
                }
                let direction = this.enemyEliteArr[a].position.sub(this.roleNode.position);
                let distance = direction.mag(); // 计算距离
                if (distance > 10) {
                    direction = direction.normalize(); // 标准化方向向量
                    // 根据距离调整速度（可选）
                    let moveSpeed
                    if (this.enemyEliteArr[a].type == (this.jyID + 7)) {
                        if (!this.enemyEliteArr[a].js) {
                            moveSpeed = this.middleSpeed + (this.middleSpeed * 0.2); // 或者根据距离动态调整速度
                        } else {
                            this.jsNum += 0.2;
                            if (this.jsNum >= 2) {
                                this.jsNum = 2;
                            }
                            moveSpeed = this.middleSpeed + (this.middleSpeed * this.jsNum); // 或者根据距离动态调整速度
                        }
                    } else {
                        moveSpeed = this.middleSpeed; // 或者根据距离动态调整速度
                    }
                    this.enemyEliteArr[a].x -= direction.x * moveSpeed * dt; // 更新x坐标
                    this.enemyEliteArr[a].y -= direction.y * moveSpeed * dt; // 更新y坐标
                }
            }
            // 计算追击者和被追目标之间的向量差
            for (let a = 0; a < this.enemyBoosArr.length; a++) {
                let direction = this.enemyBoosArr[a].position.sub(this.roleNode.position);
                let distance = direction.mag(); // 计算距离
                if (distance > 95) {
                    direction = direction.normalize(); // 标准化方向向量
                    // 根据距离调整速度（可选）
                    let moveSpeed = this.bigSpeed + (this.bigSpeed * 0.3); // 或者根据距离动态调整速度
                    this.enemyBoosArr[a].x -= direction.x * moveSpeed * dt; // 更新x坐标
                    this.enemyBoosArr[a].y -= direction.y * moveSpeed * dt; // 更新y坐标
                }
            }
        }
    }

    upEliteScore_0(cn) {
        let aui = cn.getChildByName("xiao");
        console.log(aui.childrenCount)
        for (let a = 0; a < aui.childrenCount; a++) {
            // console.log(aui.children[a].name)
            // aui.children[a].name = "boss0-1";
            aui.children[a].type = 500;
            // aui.children[a].parent = this.enemyNode;
            // let positionInParent = this.enemyNode.convertToNodeSpaceAR(aui.children[a].getPosition());
            // console.log("子节点在父节点坐标系中的位置:", positionInParent);
            // aui.children[a].setPosition(positionInParent)
            this.enemyArr.push(aui.children[a]);
        }

    }

    /*************************************左 */
    private onTouchStart(event) {
        // console.log(event.getLocation())
        // console.log("onTouchStart")
        // this.zuoyuanCZNode.setPosition(event.getLocation())
        // let aoPos = this.node.convertToNodeSpaceAR(event.getLocation());
        // this.zuoyuanCZNode.setPosition(aoPos);
        // let pos = this.zuoyuanNode.convertToNodeSpaceAR(event.getLocation());
        // this.zuoyuanNode.setPosition(pos);
    }

    private onTouchMove(event) {
        // console.log("onTouchMove")
        let posDelta = event.getDelta();
        this.zuoyuanNode.setPosition(this.zuoyuanNode.position.add(posDelta));
        this.zuoadir = this.zuoyuanNode.position.normalize();
    }

    private onTouchEnd(event) {
        // console.log("onTouchEnd")
        this.zuoyuanNode.setPosition(cc.v2(0, 0));
        this.zuoyuanCZNode.setPosition(cc.v2(-527, -197));
    }

    private onTouchCancel(event) {
        this.zuoyuanNode.setPosition(cc.v2(0, 0));
        this.zuoyuanCZNode.setPosition(cc.v2(-527, -197));
    }

    private spore(angle: number) {
        let ang = angle;
        // console.log("angle" + angle)
        if (this.bullteScope == 1) {
            let an = ang
            this.updateBullet1(an);
        } else if (this.bullteScope == 2) {
            let an = ang + 7.5
            let bn = ang - 7.5
            this.updateBullet1(an);
            this.updateBullet2(bn);
        } else if (this.bullteScope == 3) {
            let an = ang
            let bn = ang + 15
            let cn = ang - 15
            this.updateBullet1(an);
            this.updateBullet2(bn);
            this.updateBullet3(cn);
        } else if (this.bullteScope == 4) {
            let an = ang + 7.5
            let bn = ang - 7.5
            let cn = ang + 22.5
            let dn = ang - 22.5
            this.updateBullet1(an);
            this.updateBullet2(bn);
            this.updateBullet3(cn);
            this.updateBullet4(dn);
        } else if (this.bullteScope == 5) {
            let an = ang
            let bn = ang + 15
            let cn = ang - 15
            let dn = ang + 30
            let tn = ang - 30
            this.updateBullet1(an);
            this.updateBullet2(bn);
            this.updateBullet3(cn);
            this.updateBullet4(dn);
            this.updateBullet5(tn);
        } else if (this.bullteScope == 6) {
            let an = ang + 7.5
            let bn = ang - 7.5
            let cn = ang + 22.5
            let dn = ang - 22.5
            let en = ang + 37.5
            let fn = ang - 37.5
            this.updateBullet1(an);
            this.updateBullet2(bn);
            this.updateBullet3(cn);
            this.updateBullet4(dn);
            this.updateBullet5(en);
            this.updateBullet6(fn);
        } else if (this.bullteScope >= 7) {
            let an = ang
            let bn = ang + 15
            let cn = ang - 15
            let dn = ang + 30
            let en = ang - 30
            let fn = ang + 45
            let gn = ang - 45
            this.updateBullet1(an);
            this.updateBullet2(bn);
            this.updateBullet3(cn);
            this.updateBullet4(dn);
            this.updateBullet5(en);
            this.updateBullet6(fn);
            this.updateBullet7(gn);
        }
        // let skinID = PlayerMessage.playGameSkinID-1;
        // this.soundBiuShow(skinID)
    }


    /*************************************右 */
    private onTouchStartYou(event) {
        // console.log("onTouchStart")
        let pos = this.youyuanNode.convertToNodeSpaceAR(event.getLocation());
        this.youyuanNode.setPosition(pos);
    }

    private onTouchMoveYou(event) {
        // console.log("onTouchMove")
        let posDelta = event.getDelta();
        this.youyuanNode.setPosition(this.youyuanNode.position.add(posDelta));
        this.youadir = this.youyuanNode.position.normalize();

        var radian = Math.atan2(this.youyuanNode.y - this.youPoint.y, this.youyuanNode.x - this.youPoint.x); //返回来的是弧度
        // var radian = Math.atan2(this.zuoadir.y - this.zuoPoint.y, this.zuoadir.x - this.zuoPoint.x); //返回来的是弧度
        this.youtgAngle = 180 / Math.PI * radian//返回来的是角度
        // console.log("角度"+this.youtgAngle)
    }

    private onTouchEndYou(event) {
        // console.log("onTouchEnd")
        this.youyuanNode.setPosition(cc.v2(0, 0));
    }

    private onTouchCancelYou(event) {
        this.youyuanNode.setPosition(cc.v2(0, 0));
    }

    //敌机碰撞掉血
    private eneShow() {
        console.log(this.InvincibleBool);
        if (!this.InvincibleBool) {
            this.InvincibleBool = true;
            if (PlayerMessage.GameZD && cc.sys.platform == cc.sys.WECHAT_GAME) {
                wx.vibrateLong()
            }
            this.roleNode.opacity = 255;
            this.curHP -= 1;
            this.roleHPNode.width = Math.floor((this.gamePlayHp / this.curZongHP) * this.curHP);
            this.hpTxt.string = this.curHP + "";
            let ht = Number((this.InvincibleTime / 6).toFixed(1));
            cc.tween(this.roleNode)
                .to(ht, { opacity: 0 })
                .to(ht, { opacity: 255 })
                .to(ht, { opacity: 0 })
                .to(ht, { opacity: 255 })
                .to(ht, { opacity: 0 })
                .to(ht, { opacity: 255 })
                .call(() => {
                    if (this.curHP > 0) {
                        this.InvincibleBool = false;
                    }
                })
                .start();
            if (this.curHP <= 0) {
                this.curHP = 0;
                this.InvincibleBool = true
                this.hpTxt.string = this.curHP + "";
                Tip_UI.Instance.tipShow("生命值0,游戏结束");
                this.GameStart = true;
                this.gameTimerBool = false;
                PlayerMessage.playStop = true;
                // PlayerMessage.playGameTimerNum = this.gameTimer;//正式
                // PlayerMessage.playGameTimerNum = 500;//测试
                this.unschedule(this.updateGameTime)
                this.unschedule(this.updateEnemy)
                this.unschedule(this.updateEliteEnemy)
                setTimeout(() => {
                    ManagerUI.openUI("Win_UI")
                }, 1000);
                return
            } else {
                Tip_UI.Instance.tipShow("生命值-1");
            }
        }
    }

    //子弹强化
    private addBulletReinforcement() {
        if (this.tzClickBool) return; // 如果正在点击，则直接返回
        this.tzClickBool = true;

        AudioMgr.playAudioEffect(audioConfig.btnClick)
        // NetWork.setZDSJMesssage("1",PlayerMessage.playGameID,(bool,res,msg)=>{
        //     Tip_UI.Instance.tipShow(msg);
        //     if(bool){
        if (PlayerMessage.GameZD && cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.vibrateLong()
        }
        if (this.bullteStrength >= (PlayerMessage.PlayBulletHurt.length)) {
            // this.bullteStrength = (PlayerMessage.PlayBulletHurt.length-1);
            Tip_UI.Instance.tipShow("子弹强化已为最高等级");
        } else {
            console.log(PlayerMessage.PlayBulletHurt)
            let StrengthLv = PlayerMessage.PlayBulletHurt[this.bullteStrength].num;
            if (PlayerMessage.playGameScoreNum >= StrengthLv) {
                let tipLv = "金币-" + StrengthLv + ",子弹强化等级+1";
                Tip_UI.Instance.tipShow(tipLv);
                AudioMgr.playAudioEffectLiu(audioConfig.gold, this.yxlv)
                let gold = PlayerMessage.playGameScoreNum - StrengthLv;
                PlayerMessage.playGameScoreNum = gold
                if (gold < 0) {
                    gold = 0;
                }
                this.updataUserMessage(gold);

                this.subHP = PlayerMessage.PlayBulletHurt[this.bullteStrength - 1].hurt;
                PlayerMessage.PlayBulletCurHurt = this.subHP;
                this.bullteStrength += 1;
                // console.log("子弹伤害：" + PlayerMessage.PlayBulletCurHurt)
                this.btqhTxt.string = this.bullteStrength + "";
                this.scoreBoxShow(gold)
            } else {
                Tip_UI.Instance.tipShow("金币不足");
            }

        }


        //     }
        // })

        setTimeout(() => {
            this.tzClickBool = false;
        }, 1000); // 例如，设置为1000毫秒后允许再次点击
    }

    //子弹宽度
    private addBulletScope() {
        if (this.tzClickBool) return; // 如果正在点击，则直接返回
        this.tzClickBool = true;
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        // NetWork.setZDSJMesssage("2",PlayerMessage.playGameID,(bool,res,msg)=>{
        //     Tip_UI.Instance.tipShow(msg);
        //     if(bool){
        if (PlayerMessage.GameZD && cc.sys.platform == cc.sys.WECHAT_GAME) {
            wx.vibrateLong()
        }
        console.log(PlayerMessage.PlayBulletRange)
        if (this.bullteScope >= (PlayerMessage.PlayBulletRange.length)) {
            // this.bullteScope = (PlayerMessage.PlayBulletRange.length-1);
            Tip_UI.Instance.tipShow("子弹范围已为最高等级");
        } else {
            let ScopeLv = PlayerMessage.PlayBulletRange[this.bullteScope].num;
            if (PlayerMessage.playGameScoreNum >= ScopeLv) {
                let tipLv = "金币-" + ScopeLv + ",子弹范围等级+1";
                Tip_UI.Instance.tipShow(tipLv);
                AudioMgr.playAudioEffectLiu(audioConfig.gold, this.yxlv)
                let gold = PlayerMessage.playGameScoreNum - ScopeLv;
                PlayerMessage.playGameScoreNum = gold
                if (gold < 0) {
                    gold = 0;
                }
                this.bullteScope += 1;
                this.zdfwTxt.string = this.bullteScope + "";
                this.updataUserMessage(gold);
                this.scoreBoxShow(gold)
            } else {
                Tip_UI.Instance.tipShow("金币不足");
            }

        }


        // }
        // })
        setTimeout(() => {
            this.tzClickBool = false;
        }, 1000); // 例如，设置为500毫秒后允许再次点击
    }

    //设置按钮
    private setClick() {
        cc.audioEngine.stopAllEffects()
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        this.GameStart = true;
        this.gameTimerBool = false;
        this.unschedule(this.updateGameTime)
        this.unschedule(this.updateEnemy)
        this.unschedule(this.updateEliteEnemy)
        PlayerMessage.PlaySetUI = true;
        ManagerUI.openUI("Set_UI");
    }

    //加钱按钮
    private addGoldClick() {
        cc.audioEngine.stopAllEffects()
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        this.GameStart = true;
        this.gameTimerBool = false;
        this.unschedule(this.updateGameTime)
        this.unschedule(this.updateEnemy)
        this.unschedule(this.updateEliteEnemy)
        ManagerUI.openUI("Gold_UI")
    }

    //复活
    private againClick() {
        this.unschedule(this.updateGameTime)
        this.unschedule(this.updateEnemy)
        this.unschedule(this.updateEliteEnemy)
        this.InvincibleBool = true;
        this.curHP = 1;
        this.hpTxt.string = this.curHP + "";
        this.roleNode.stopAllActions();
        this.roleNode.opacity = 255;
        cc.tween(this.roleNode)
            .to(0.3, { opacity: 0 })
            .call(() => {
                PlayerMessage.playStop = false;
                this.GameStart = false;
                this.gameTimerBool = true;
                this.roleHPNode.width = Math.floor((this.gamePlayHp / this.curZongHP) * this.curHP);
                this.schedule(this.updateGameTime, 1)
                this.schedule(this.updateEnemy, this.enemyFrequency)
                this.schedule(this.updateEliteEnemy, this.EliteFrequency)
                Tip_UI.Instance.tipShow("复活成功，生命值+1");
            })
            .to(0.3, { opacity: 255 })
            .to(0.3, { opacity: 0 })
            .to(0.3, { opacity: 255 })
            .to(0.3, { opacity: 0 })
            .to(0.3, { opacity: 255 })
            .delay(1)
            .call(() => {
                this.InvincibleBool = false;
            })
            .start();
    }

    //游戏暂停
    private gameStop() {
        this.GameStart = false;
        this.gameTimerBool = true;
        this.InvincibleBool = false;
        this.schedule(this.updateGameTime, 1)
        this.schedule(this.updateEnemy, this.enemyFrequency)
        this.schedule(this.updateEliteEnemy, this.EliteFrequency)
        // if(this.GameStart){

        // }
    }

    //游戏积分更新
    updataUser(gold: any) {
        PlayerMessage.playGameScoreNum += Number(gold);
        this.jbTxt.string = PlayerMessage.playGameScoreNum + "";
        this.scoreBoxShow(PlayerMessage.playGameScoreNum)
        //个人信息
        // NetWork.getPlayMessage((bool,res,msg)=>{
        //     if(bool){
        //         // PlayerMessage.playGameScoreNum = res.data.score;
        //         PlayerMessage.playGameStoreNum = res.data.money;
        //         this.curGold = PlayerMessage.playGameScoreNum;

        //     }
        // })
    }

    //游戏积分更新
    updataUserMessage(gold: any) {
        this.jbTxt.string = gold + "";
        //个人信息
        // NetWork.getPlayMessage((bool,res,msg)=>{
        //     if(bool){
        //         // PlayerMessage.playGameScoreNum = res.data.score;
        //         PlayerMessage.playGameStoreNum = res.data.money;
        //         this.curGold = PlayerMessage.playGameScoreNum;

        //     }
        // })
    }

    updataPiaoZiShow(id) {
        let typeID = id;
        if (typeID <= 0) {
            typeID = 1
        }
        console.log("怪物ID：" + typeID)
        let mon = Number(GameFidhtMessage.Fight_Enemy_Small_Monster[typeID - 1].money);
        if (mon == null || mon == undefined) {
            mon = 20
        }
        this.pziNode.string = "+" + mon + "";
        PlayerMessage.playGameScoreNum += mon;
        console.log("金币：" + PlayerMessage.playGameScoreNum)
        this.jbTxt.string = PlayerMessage.playGameScoreNum + "";
        this.scoreBoxShow(PlayerMessage.playGameScoreNum)
        cc.Tween.stopAllByTarget(this.piaoNode)
        this.piaoNode.active = true;
        this.piaoNode.y = 0;
        this.piaoNode.opacity = 0;
        cc.tween(this.piaoNode)
            .to(0.2, { y: 115, opacity: 255 })
            .delay(0.5)
            .call(() => {
                this.piaoNode.active = false;
                this.piaoNode.opacity = 0;
            })
            .start();

        NetWork.setEnemyScoreMesssage(PlayerMessage.playGameID, typeID, (bool, res, msg) => {
            if (bool) {
                // this.updataUserMessage();
            }
        })
    }

    updataPiaoZiShow2(id) {
        let typeID = id - 100;
        // console.log("怪物ID：" + typeID)
        // console.log("怪物JB：" + GameFidhtMessage.Fight_Enemy_Small_Money[typeID-1].money)
        if (typeID <= 0) {
            typeID = 0;
        }
        let mon = Number(GameFidhtMessage.Fight_Enemy_Middle_Monster[typeID].money);
        if (mon == null || mon == undefined) {
            mon = 20 * 2
        }
        this.pziNode.string = "+" + mon + "";
        PlayerMessage.playGameScoreNum += mon;
        this.jbTxt.string = PlayerMessage.playGameScoreNum + "";
        this.scoreBoxShow(PlayerMessage.playGameScoreNum)
        cc.Tween.stopAllByTarget(this.piaoNode)
        this.piaoNode.active = true;
        this.piaoNode.y = 0;
        this.piaoNode.opacity = 0;
        cc.tween(this.piaoNode)
            .to(0.2, { y: 115, opacity: 255 })
            .delay(0.5)
            .call(() => {
                this.piaoNode.active = false;
                this.piaoNode.opacity = 0;
            })
            .start();

        NetWork.setEnemyScoreMesssage(PlayerMessage.playGameID, typeID, (bool, res, msg) => {
            if (bool) {
                // this.updataUserMessage();
            }
        })
    }

    updataPiaoZiShow3(id) {
        let typeID = id - 10000;
        if (typeID <= 0) {
            typeID = 0
        }
        // console.log("怪物ID：" + typeID)
        // console.log("怪物JB：" + GameFidhtMessage.Fight_Enemy_Small_Monster[typeID-1].money)
        let mon = Number(GameFidhtMessage.Fight_Enemy_Big_Monster[typeID].money);
        if (mon == null || mon == undefined) {
            mon = 20 * 5
        }
        this.pziNode.string = "+" + mon + "";
        PlayerMessage.playGameScoreNum += mon;
        this.jbTxt.string = PlayerMessage.playGameScoreNum + "";
        this.scoreBoxShow(PlayerMessage.playGameScoreNum)
        cc.Tween.stopAllByTarget(this.piaoNode)
        this.piaoNode.active = true;
        this.piaoNode.y = 0;
        this.piaoNode.opacity = 0;
        cc.tween(this.piaoNode)
            .to(0.2, { y: 115, opacity: 255 })
            .delay(0.5)
            .call(() => {
                this.piaoNode.active = false;
                this.piaoNode.opacity = 0;

            })
            .start();

        NetWork.setEnemyScoreMesssage(PlayerMessage.playGameID, typeID, (bool, res, msg) => {
            if (bool) {
                // this.updataUserMessage();
            }
        })
    }



    updateGameTime() {
        if (this.gameTimerBool) {
            this.gameTimer += 1;
            let atim = Math.floor(this.gameTimer / this.tsMiao);
            PlayerMessage.playGameTimerNum = atim;//正式
            this.tianTxt.string = "第" + (atim + 1) + "天";
            if (atim > 0) {
                let tiao = this.tsMiao * this.BossFrequency;
                // let tiao =10//测试
                if (this.gameTimer % tiao == 0) {
                    this.tsNode.active = true;
                    // AudioMgr.pauseBGMusic();
                    cc.audioEngine.stopAllEffects()
                    AudioMgr.playAudioEffect2(audioConfig.bossShowSD)
                    this.tsNode.getComponent(cc.Animation).play("tishi")
                    this.updateBoosEnemy();
                    // setTimeout(() => {
                    //     AudioMgr.resumeBGMusic();
                    // }, 5000);
                    setTimeout(() => {
                        this.tsNode.active = false;
                        this.tsNode.getComponent(cc.Animation).stop("tishi")
                    }, 2000);
                }
                // if(!this.boosBool){
                //     this.boosBool = true;
                //     this.tsNode.active = true;
                //     this.updateBoosEnemy();
                //     setTimeout(() => {
                //         this.tsNode.active = false;  
                //     }, 2000);
                // }else{
                //     this.boosBool = false;
                // }
            }

            // if(this.gameTimer==150){
            //     this.unschedule(this.updateEnemy)
            //     this.enemyFrequency = 4;
            //     this.schedule(this.updateEnemy,this.enemyFrequency)
            // }else if(this.gameTimer==300){
            //     this.unschedule(this.updateEnemy)
            //     this.enemyFrequency = 3;
            //     this.schedule(this.updateEnemy,this.enemyFrequency)
            // }else if(this.gameTimer==450){c:\Users\Administrator\Documents\WXWork\1688854720581731\Cache\Image\2025-12\企业微信截图_17667439354879.png
            //     this.unschedule(this.updateEnemy)
            //     this.enemyFrequency = 2;
            //     this.schedule(this.updateEnemy,this.enemyFrequency)
            // }else if(this.gameTimer==600){
            //     this.unschedule(this.updateEnemy)
            //     this.enemyFrequency = 1;
            //     this.schedule(this.updateEnemy,this.enemyFrequency)
            // }
        }
    }

    bianbianShowMessage() {
        this.unschedule(this.sdSubShow);
        this.yiDongSpeed = true;
        this.jsNode.active = true;
        this.schedule(this.sdSubShow, 5);
        console.log("--------减速--------")
    }

    sdSubShow() {
        console.log("--------减速--------")
        this.unschedule(this.sdSubShow);
        this.yiDongSpeed = false;
        this.jsNode.active = false;
    }

    yinboShowMessage() {
        this.unschedule(this.ybSubShow);
        this.bullteRate = 10;
        this.ybNode.active = true;
        let skinID = PlayerMessage.playGameSkinID - 1;
        if (skinID == 1) {
            this.zdAu = 120;
        } else if (skinID == 3) {
            this.zdAu = 120;
            // }else if(skinID == 5){
            //     console.log("走没")
            //     this.zdAu = 260;
        } else {
            this.zdAu = 30;
        }
        let t = GameFidhtMessage.Fight_Enemy_Elite9_Reduce_Time * 2
        this.schedule(this.ybSubShow, t);//降低速率
        console.log("--------音波--------")
    }

    ybSubShow() {
        console.log("--------音波--------")
        this.unschedule(this.ybSubShow);
        for (let a = 0; a < this.sxTimeArr.length; a++) {
            this.sxTimeArr[a] = 0
        }
        let skinID = PlayerMessage.playGameSkinID - 1;
        if (skinID == 1) {
            this.zdAu = 90;
        } else if (skinID == 3) {
            this.zdAu = 60;
            // }else if(skinID == 5){
            //     this.zdAu = 130;
        } else {
            this.zdAu = 10;
        }
        this.bullteRate = 5;
        this.ybNode.active = false;
        console.log(this.bullteRate)
    }

    danShowMessage() {
        // this.unschedule(this.danShow);
        // this.schedule(this.danShow,5);
        console.log("--------下蛋--------")
        this.eneShow();
    }

    danShow() {
        console.log("--------下蛋--------")
        // this.unschedule(this.danShow);
    }

    scoreBoxShow(goldNum) {
        // this.curGold = 0;
        // console.log('子弹强度等级 ',this.bullteStrength, '最大强度等级', PlayerMessage.PlayBulletHurt.length)
        if (this.bullteStrength < (PlayerMessage.PlayBulletHurt.length)) {
            let StrengthLv = PlayerMessage.PlayBulletHurt[this.bullteStrength].num;
            if (goldNum >= StrengthLv) {
                this.heiYuan[3].active = true;
            } else {
                this.heiYuan[3].active = false;
            }
        } else {
            this.heiYuan[1].active = true;
            this.heiYuan[3].active = false;
        }
        // console.log('子弹范围等级 ',this.bullteScope, '最大范围等级', PlayerMessage.PlayBulletRange.length)
        if (this.bullteScope < (PlayerMessage.PlayBulletRange.length)) {
            let ScopeLv = PlayerMessage.PlayBulletRange[this.bullteScope].num;
            if (goldNum >= ScopeLv) {
                this.heiYuan[2].active = true;
            } else {
                this.heiYuan[2].active = false;
            }
        } else {
            this.heiYuan[0].active = true;
            this.heiYuan[2].active = false;
        }
        // if(this.bullteStrength >= (PlayerMessage.PlayBulletHurt.length-1)){
        //     this.heiYuan[1].active = true;
        // // }else{
        // //     this.heiYuan[2].active = true;
        // }
        // if(this.bullteScope >= (PlayerMessage.PlayBulletRange.length-1)){
        //     this.heiYuan[0].active = true;
        // // }else{
        // //     this.heiYuan[3].active = true;
        // }

        // console.log("剩余总钱数：" + goldNum)
        // console.log("升级子弹宽度钱数：" + ScopeLv)
        // console.log("升级子弹强度钱数：" + StrengthLv)
    }

    soundBiuShow(id) {
        let yid = id
        switch (yid) {
            case 0:
                this.yxlv = 0.5;
                AudioMgr.playAudioEffectLiu(audioConfig.YDSD, 0.5)
                break;
            case 1:
                this.yxlv = 0.5;
                AudioMgr.playAudioEffectLiu(audioConfig.SYSD, 0.5)
                break;
            case 2:
                this.yxlv = 0.5;
                AudioMgr.playAudioEffectLiu(audioConfig.CHSD, 0.5)
                break;
            case 3:
                this.yxlv = 0.5;
                AudioMgr.playAudioEffectLiu(audioConfig.SDSD, 0.3)
                break;
            case 4:
                this.yxlv = 0.5;
                AudioMgr.playAudioEffectLiu(audioConfig.JQRSD, 0.2)
                break;
            case 5:
                this.yxlv = 0.5;
                AudioMgr.playAudioEffectLiu(audioConfig.UFOSD, 0.8)
                break;
            case 6:
                this.yxlv = 0.5;
                AudioMgr.playAudioEffectLiu(audioConfig.XZSD, 0.3)
                break;
            case 7:
                this.yxlv = 0.5;
                AudioMgr.playAudioEffectLiu(audioConfig.TZSD, 0.5)
                break;
            case 8:
                this.yxlv = 0.5;
                AudioMgr.playAudioEffectLiu(audioConfig.XMSD, 0.5)
                break;
            case 9:
                this.yxlv = 0.5;
                AudioMgr.playAudioEffectLiu(audioConfig.XGSD, 0.5)
                break;
            case 10:
                break;
            default:
                break;
        }
    }
}

/**方向 */
export enum Dir {
    /**上 */
    Up = 0,
    /**下 */
    Down = 1,
    /**左 */
    Left = 2,
    /**右 */
    Right = 3
}
