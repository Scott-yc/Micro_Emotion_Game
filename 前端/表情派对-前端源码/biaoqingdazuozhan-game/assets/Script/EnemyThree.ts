
import { audioConfig, GameFidhtMessage, PlayerMessage } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { ManagerUI } from "./work/ManagerUI";
import { Observer } from "./work/Observer";


const {ccclass, property} = cc._decorator;

@ccclass
export default class EnemyTwo extends cc.Component {

    @property({ type: cc.Node, tooltip: "地图节点" })
    dieNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "血条" })
    xiaozuoNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "xiao" })
    xiaoNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "愤怒" })
    fnNode: cc.Node = null;
    private allHP=0;

    onLoad () {
        
    }

    onEnable () {
        this.fnNode.active = false;
        this.allHP = this.node.hp;
        console.log("总血3333：" + this.allHP)
    }

    enemyHP(){
        // console.log("总血：" + this.node.hp)
        // console.log("减血：" + PlayerMessage.PlayBulletCurHurt)
        this.node.hp -= PlayerMessage.PlayBulletCurHurt
        if(this.node.hp <= 0){
            this.node.hp = 0;
            this.xiaozuoNode.width = 0;
            this.fnNode.active = false;
            this.node.getComponent(cc.BoxCollider).enabled = false;
            cc.tween(this.node)
                .to(0.2, { opacity: 0 })
                .to(0.2, { opacity: 255 })
                .to(0.2, { opacity: 0 })
                .call(() => {
                    let skinID = PlayerMessage.playGameSkinID-1;
                    // cc.audioEngine.stopAllEffects()
                        if(skinID == 4 || skinID == 6){
                            AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD,0.2)
                        }else{
                            AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD,0.5)
                        }
                    this.node.active = false
                    this.fnNode.active = false;
                    console.log("-------:" + this.node.move)
                    if(!this.node.move){
                        this.xiaoNode.opacity = 0;
                        this.xiaoNode.active = false;
                        this.node.active = false;
                        for (let a = 0; a < this.xiaoNode.children.length; a++) {
                            this.xiaoNode.children[a].getComponent(cc.BoxCollider).enabled = false;
                        }
                        return;
                    }
                    this.dieNode.active = true;
                    this.schedule(this.dieShow,0.5)
                    // console.log(this.node.type)
                    // Observer.emit("upScore",this.node.type)
                    if(this.node.type == 100){
                        Observer.emit("upEliteScore",this.node.type)
                        Observer.emit("upEliteScore_0",this.node.parent)
                    }
                })
            .start();
            return
        }
        // let banHP = Number(GameFidhtMessage.Fight_Enemy_Small_Monster[0].blood)
        // this.xiaozuoNode.width = (this.node.hp/banHP)*90
        this.xiaozuoNode.width = (this.node.hp/this.allHP)*130
    }

    dieShow(){
        this.unschedule(this.dieShow)
        this.dieNode.active = false;
        this.fnNode.active = false;
        for (let a = 0; a < this.xiaoNode.children.length; a++) {
            let tx = Math.floor(Math.random()*2)
            let ty = Math.floor(Math.random()*2)
            let ax
            let ay
            if(tx == 0){
                ax = (Math.floor(Math.random()*20))+20
            }else{
                ax = -(Math.floor(Math.random()*20))-20
            }
            if(ty == 0){
                ay = (Math.floor(Math.random()*20))+20
            }else{
                ay = -(Math.floor(Math.random()*20))-20
            }
            if(this.xiaoNode.children[a].active){
                cc.tween(this.xiaoNode.children[a])
                    .to(5, { x:ax ,y:ay})
                    .call(() => {
                    })
                    .start()
                // this.xiaoNode.children[a].x = 0;
                // this.xiaoNode.children[a].y = 0;

                // this.xiaoNode.children[a].parent=this.node.parent.parent;
            }
        }
    }



    enemyClear(){
        this.node.active = false
    }
    /**
     * 碰撞处理
     * */
    onCollisionEnter (other, self) {

        // this.collisionEnemy(other, self);

        // if (!this.bThrought){
            // this.node.destroy();
        // }
        if(other.node.name == "player"){
            this.dieShow();
            console.log("aaaaa")
            Observer.emit("eneShow")
            this.enemyClear()
        }
        
        // console.log('玩家碰撞');
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * */
    onCollisionStay(other, self){
        if(other.node.name == "player"){
            console.log("bbbbbbbbbb")
            this.dieShow();
            Observer.emit("eneShow")
            this.enemyClear()
        }
    }

    /** 当碰撞结束后调用 */
    onCollisionExit(other, self){
        if(other.node.name == "player"){
            this.dieShow();
            Observer.emit("eneShow")
            this.enemyClear()
        }
    }

    update (dt) {

    }


}
