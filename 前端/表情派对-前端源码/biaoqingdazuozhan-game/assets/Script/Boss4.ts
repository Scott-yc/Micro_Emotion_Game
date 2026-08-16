
import { audioConfig, GameFidhtMessage, PlayerMessage } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { ManagerUI } from "./work/ManagerUI";
import { Observer } from "./work/Observer";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Boss4 extends cc.Component {

    @property({ type: cc.Node, tooltip: "血条" })
    xueNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "小怪" })
    daNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "小怪" })
    xiaoNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "小怪" })
    fenNode: cc.Node[] = [];

    @property({ type: cc.Node, tooltip: "血条" })
    xiaozuoNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "血条" })
    xiaoyouNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "die" })
    dieNode: cc.Node[] = [];



    private allHP = 0;

    private banHP = 0

    onLoad() {

    }

    onEnable() {
        // this.fenNode[0].hp = 0;
        // this.fenNode[1].hp = 0;
        this.fenNode[0].name = "boss4-1";
        this.fenNode[1].name = "boss4-2";
        this.dieNode[0].active = false;
        this.dieNode[1].active = false;
        this.dieNode[2].active = false;
        // this.node.name = "Boss4";
        // this.banHP = 0;
        this.daNode.active = true;
        this.xiaoNode.active = false;
        this.fenNode[0].getComponent(cc.BoxCollider).enabled = false;
        this.fenNode[1].getComponent(cc.BoxCollider).enabled = false;
    }



    sethp(hp: any, shp: any, pos: any) {
        this.allHP = hp;
        let spos = this.randomPos();
        // let emX = Math.abs(pos.x-spos.x)
        // let emY = Math.abs(pos.y-spos.y)
        // let ran = Math.floor(Math.random()*2)
        // if(emX<300){
        //     if(ran == 0){
        //         spos.x+=300
        //     }else{
        //         spos.x-=300
        //     }
        // }
        // if(emY<300){
        //     if(ran == 0){
        //         spos.y+=300
        //     }else{
        //         spos.y-=300
        //     }
        // }
        this.node.setPosition(spos);
        let banHP = GameFidhtMessage.Fight_Enemy_Small_Monster[4].minion_blood;
        if (banHP == null || banHP == undefined) {
            banHP = this.allHP / 2;
        }
        this.fenNode[0].hp = banHP;
        this.fenNode[1].hp = banHP;
        this.banHP = banHP;
        // this.subHP = shp;
        // this.subHP = 10;//测试
        // console.log("初始化总血：" + this.allHP)
        // console.log("初始化减血：" + this.subHP)
    }

    enemyType(type: any) {
        this.node.type = type
    }

    enemyClear() {
        // this.node.destroy();
        this.node.active = false
    }

    dieBoss4() {
        this.daNode.stopAllActions();
        this.fenNode[0].stopAllActions();
        this.fenNode[1].stopAllActions();
        this.fenNode[0].getComponent(cc.BoxCollider).enabled = false;
        this.fenNode[1].getComponent(cc.BoxCollider).enabled = false;
        this.xiaoNode.active = false;
    }



    enemyHP() {
        // console.log("总血：" + this.allHP)
        // console.log("减血：" + this.subHP)
        this.node.hp -= PlayerMessage.PlayBulletCurHurt
        if (this.node.hp <= 0) {
            this.node.hp = 0;
            this.xueNode.width = 0;
            let aNode = this.node.getChildByName("Boss4")
            aNode.getComponent(cc.BoxCollider).enabled = false;
            cc.tween(aNode)
                .to(0.2, { opacity: 0, scale: 1 })
                .to(0.2, { opacity: 255, scale: 0.9 })
                .to(0.2, { opacity: 0, scale: 1 })
                .call(() => {
                    let skinID = PlayerMessage.playGameSkinID - 1;
                    // cc.audioEngine.stopAllEffects()
                    if (skinID == 4 || skinID == 6) {
                        AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD, 0.2)
                    } else {
                        AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD, 0.5)
                    }
                    aNode.active = false
                    this.daNode.active = false;
                    this.xiaoNode.active = true;
                    cc.tween(this.fenNode[0])
                        .bezierTo(0.5, new cc.Vec2(0, 0), new cc.Vec2(-35, 70), new cc.Vec2(-70, 0))
                        .call(() => {
                            this.fenNode[0].getComponent(cc.BoxCollider).enabled = true;
                        })
                        .start();

                    cc.tween(this.fenNode[1])
                        .bezierTo(0.5, new cc.Vec2(0, 0), new cc.Vec2(35, 70), new cc.Vec2(70, 0))
                        .call(() => {
                            this.fenNode[1].getComponent(cc.BoxCollider).enabled = true;
                        })
                        .start();

                    // setTimeout(() => {
                    //     this.fenNode[0].getComponent(cc.BoxCollider).enabled = true;
                    //     this.fenNode[1].getComponent(cc.BoxCollider).enabled = true;
                    // }, 500);
                    // this.dieNode[0].active = true;
                    // this.schedule(this.dieShow,0.5)
                    // console.log(this.node.type)
                    Observer.emit("upEliteScore", this.node.type)
                })
                .start();

            return
        }
        this.xueNode.width = (this.node.hp / this.allHP) * 130
    }

    dieShow() {
        this.unschedule(this.dieShow)
        this.dieNode[0].active = false;
    }

    dieShow1() {
        this.unschedule(this.dieShow1)
        this.dieNode[1].active = false;
    }


    dieShow2() {
        this.unschedule(this.dieShow2)
        this.dieNode[2].active = false;
    }




    enemyXiaoZuoHP() {
        console.log("总血：" + this.allHP)
        // console.log("减血：" + this.subHP)
        this.fenNode[0].hp -= PlayerMessage.PlayBulletCurHurt
        if (this.fenNode[0].hp <= 0) {
            this.fenNode[0].hp = 0;
            this.xiaozuoNode.width = 0;
            this.fenNode[0].getComponent(cc.BoxCollider).enabled = false;
            cc.tween(this.fenNode[0])
                .to(0.2, { opacity: 0 })
                .to(0.2, { opacity: 255 })
                .to(0.2, { opacity: 0 })
                .call(() => {
                    this.fenNode[0].active = false
                    this.dieNode[1].active = true;
                    let skinID = PlayerMessage.playGameSkinID - 1;
                    // cc.audioEngine.stopAllEffects()
                    if (skinID == 4 || skinID == 6) {
                        AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD, 0.2)
                    } else {
                        AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD, 0.5)
                    }
                    this.schedule(this.dieShow1, 0.5)
                    // console.log(this.node.type)
                    // Observer.emit("upScore",this.node.type)
                })
                .start();

            return
        }
        this.xiaozuoNode.width = (this.fenNode[0].hp / this.banHP) * 90
    }

    enemyXiaoYouHP() {
        console.log("总血：" + this.allHP)
        // console.log("减血：" + this.subHP)
        this.fenNode[1].hp -= PlayerMessage.PlayBulletCurHurt
        if (this.fenNode[1].hp <= 0) {
            this.fenNode[1].hp = 0;
            this.xiaoyouNode.width = 0;
            this.fenNode[1].getComponent(cc.BoxCollider).enabled = false;
            cc.tween(this.fenNode[1])
                .to(0.2, { opacity: 0 })
                .to(0.2, { opacity: 255 })
                .to(0.2, { opacity: 0 })
                .call(() => {
                    this.fenNode[1].active = false
                    this.dieNode[2].active = true;
                    let skinID = PlayerMessage.playGameSkinID - 1;
                    // cc.audioEngine.stopAllEffects()
                    if (skinID == 4 || skinID == 6) {
                        AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD, 0.2)
                    } else {
                        AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD, 0.5)
                    }
                    this.schedule(this.dieShow2, 0.5)
                    // console.log(this.node.type)
                    // Observer.emit("upScore",this.node.type)
                })
                .start();

            return
        }
        this.xiaoyouNode.width = (this.fenNode[1].hp / this.banHP) * 90
    }

    randomPos() {
        let a1 = Math.floor(Math.random() * 4)
        let posX
        let posY
        if (a1 == 0) {
            posX = 0 - (Math.floor(Math.random() * 300)) - 1334
            posY = Math.floor(Math.random() * 1800) - 900
        } else if (a1 == 1) {
            posX = Math.floor(Math.random() * 300) + 1334
            posY = Math.floor(Math.random() * 1800) - 900
        } else if (a1 == 2) {
            posX = Math.floor(Math.random() * 2968) - 1484
            posY = 0 - (Math.floor(Math.random() * 300)) - 750
        } else if (a1 == 3) {
            posX = Math.floor(Math.random() * 2968) - 1484
            posY = Math.floor(Math.random() * 300) + 750
        }
        // return cc.v2(500, 375);
        return cc.v2(posX, posY);
    }

    /**
     * 碰撞处理
     * */
    // onCollisionEnter (other, self) {

    //     // this.collisionEnemy(other, self);

    //     // if (!this.bThrought){
    //         // this.node.destroy();
    //     // }
    //     if(other.node.name == "player"){
    //         Observer.emit("eneShow")
    //         this.enemyClear()
    //     }

    //     // console.log('玩家碰撞');
    // }

    // /**
    //  * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
    //  * */
    // onCollisionStay(other, self){
    //     if(other.node.name == "player"){
    //         Observer.emit("eneShow")
    //         this.enemyClear()
    //     }
    // }

    // /** 当碰撞结束后调用 */
    // onCollisionExit(other, self){
    //     if(other.node.name == "player"){
    //         Observer.emit("eneShow")
    //         this.enemyClear()
    //     }
    // }


    enemyTwo(type) {
        this.allHP = Number(GameFidhtMessage.Fight_Enemy_Small_Money[type].blood) * 3;
        this.node.hp = this.allHP;
        this.xueNode.width = (this.node.hp / this.allHP) * 90
    }

    enemyFive(type) {

    }

    update(dt) {

    }


}
