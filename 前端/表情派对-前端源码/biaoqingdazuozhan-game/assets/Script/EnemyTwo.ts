
import { audioConfig, GameFidhtMessage, PlayerMessage } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { ManagerUI } from "./work/ManagerUI";
import { Observer } from "./work/Observer";


const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyTwo extends cc.Component {

    @property({ type: cc.Node, tooltip: "地图节点" })
    dieNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "血条" })
    xiaozuoNode: cc.Node = null;


    onLoad() {

    }

    onEnable() {
        // console.log("总血2222：" + this.node.hp)
        // console.log("总血2222....：" + Number(GameFidhtMessage.Fight_Enemy_Small_Monster[0].blood) / 2)
    }

    enemyHP() {
        // console.log("总血：" + this.node.hp)
        // console.error("减血2222：" + PlayerMessage.PlayBulletCurHurt)
        this.node.hp -= PlayerMessage.PlayBulletCurHurt
        if (this.node.hp <= 0) {
            this.node.hp = 0;
            this.xiaozuoNode.width = 0;
            this.node.getComponent(cc.BoxCollider).enabled = false;
            cc.tween(this.node)
                .to(0.2, { opacity: 0 })
                .to(0.2, { opacity: 255 })
                .to(0.2, { opacity: 0 })
                .call(() => {
                    let skinID = PlayerMessage.playGameSkinID - 1;
                    // cc.audioEngine.stopAllEffects()
                    if (skinID == 4 || skinID == 6) {
                        AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD, 0.2)
                    } else {
                        AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD, 0.5)
                    }
                    this.node.active = false
                    this.dieNode.active = true;
                    this.schedule(this.dieShow, 0.5)
                    // console.log(this.node.type)
                    // Observer.emit("upScore",this.node.type)
                    if (this.node.type == 100) {
                        Observer.emit("upEliteScore", this.node.type)
                        Observer.emit("upEliteScore_0", this.node.parent)
                    }
                })
                .start();
            return
        }
        let banHP = Number(GameFidhtMessage.Fight_Enemy_Small_Monster[0].blood) / 2
        this.xiaozuoNode.width = (this.node.hp / banHP) * 90
    }

    dieShow() {
        this.unschedule(this.dieShow)
        this.dieNode.active = false;
    }



    enemyClear() {
        this.node.active = false
    }
    /**
     * 碰撞处理
     * */
    onCollisionEnter(other, self) {
        console.log(this.node.name)
        this.dieShow();
        // this.collisionEnemy(other, self);

        // if (!this.bThrought){
        // this.node.destroy();
        // }
        if (other.node.name == "player") {
            this.dieShow();
            Observer.emit("eneShow")
            this.enemyClear()
        }

        // console.log('玩家碰撞');
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * */
    onCollisionStay(other, self) {
        if (other.node.name == "player") {
            this.dieShow();
            Observer.emit("eneShow")
            this.enemyClear()
        }
    }

    /** 当碰撞结束后调用 */
    onCollisionExit(other, self) {
        if (other.node.name == "player") {
            this.dieShow();
            Observer.emit("eneShow")
            this.enemyClear()
        }
    }

    update(dt) {

    }


}
