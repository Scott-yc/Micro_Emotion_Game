
import { audioConfig, PlayerMessage } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { ManagerUI } from "./work/ManagerUI";
import { Observer } from "./work/Observer";


const {ccclass, property} = cc._decorator;

@ccclass
export default class BossDa extends cc.Component {

    @property({ type: cc.Node, tooltip: "血条" })
    xueNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "骷髅" })
    dieNode: cc.Node = null;

    @property({ type: cc.Sprite, tooltip: "骷髅" })
    mcSpr: cc.Sprite = null;

    @property({ type: cc.SpriteFrame, tooltip: "骷髅" })
    mcSf: cc.SpriteFrame[] = [];

    private allHP=0;
    private subHP=0;

    onLoad () {
        
    }

    onEnable () {
        this.dieNode.active = false;
    }


    setBooshp(hp:any,shp:any,pos:any,id:any){
        this.allHP = hp;
        let au = 0
        let bu = 0
        let ran1 = Math.floor(Math.random()*2)
        let ran2 = Math.floor(Math.random()*2)
        if(ran1 == 0){
            au=-1500
        }else{
            au=1500
        }
        if(ran2 == 0){
            bu=-1500
        }else{
            bu=1500
        }
        this.mcSpr.spriteFrame = this.mcSf[id]
        this.node.setPosition(cc.v3(au,bu));
        console.log(this.node.getPosition())
    }

    enemyType(type:any){
        this.node.type = type
    }

    enemyClear(){
        // this.node.destroy();
        this.node.active = false
    }

    enemyHP(){
        // console.log("总血：" + this.allHP)
        // console.log("减血：" + this.subHP)
        this.node.hp -= PlayerMessage.PlayBulletCurHurt
        if(this.node.hp <= 0){
            this.node.hp = 0;
            this.xueNode.width = 0;
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
                    this.dieNode.active = true;
                    this.schedule(this.dieShow,2)
                    // console.log(this.node.type)
                    Observer.emit("bossDaScore",this.node.type)
                })
            .start();
            
            return
        }
        this.xueNode.width = (this.node.hp/this.allHP)*180
    }

    dieShow(){
        this.unschedule(this.dieShow)
        this.dieNode.active = false;
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
            Observer.emit("eneShow")
            // this.enemyClear()
        }
        
        // console.log('玩家碰撞');
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * */
    onCollisionStay(other, self){
        if(other.node.name == "player"){
            Observer.emit("eneShow")
            // this.enemyClear()
        }
    }

    /** 当碰撞结束后调用 */
    onCollisionExit(other, self){
        if(other.node.name == "player"){
            Observer.emit("eneShow")
            // this.enemyClear()
        }
    }

    update (dt) {

    }


}
