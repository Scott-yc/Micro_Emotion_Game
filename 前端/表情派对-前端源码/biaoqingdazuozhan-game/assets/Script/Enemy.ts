
import { audioConfig, PlayerMessage } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { ManagerUI } from "./work/ManagerUI";
import { Observer } from "./work/Observer";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    @property({ type: cc.Node, tooltip: "血条" })
    xueBGNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "血条" })
    xueNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "骷髅" })
    dieNode: cc.Node = null;

    private allHP=0;
    private subHP=0;

    onLoad () {
        
    }

    onEnable () {
        this.node.name = "Enemy"
        this.dieNode.active = false;
        this.xueBGNode.active = true;
    }

    sethp(hp:any,shp:any,pos:any){
        this.allHP = hp;
        let spos = this.randomPos();
        let emX = Math.abs(pos.x-spos.x)
        let emY = Math.abs(pos.y-spos.y)
        let ran = Math.floor(Math.random()*2)
        if(emX<300){
            if(ran == 0){
                spos.x+=1000
            }else{
                spos.x-=1000
            }
        }
        if(emY<300){
            if(ran == 0){
                spos.y+=1000
            }else{
                spos.y-=1000
            }
        }
        this.node.setPosition(spos);
        // this.subHP = shp;
        // this.subHP = 10;//测试
        // console.log("初始化总血：" + this.allHP)
        // console.log("初始化减血：" + this.subHP)
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
                    // this.node.active = false
                    this.xueBGNode.active = false;
                    this.node.getComponent(cc.Sprite).spriteFrame = null;
                    this.node.opacity = 255
                    this.dieNode.active = true;
                    this.schedule(this.dieShow,0.5)
                    // console.log(this.node.type)
                    Observer.emit("upScore",this.node.type)
                })
            .start();
            
            return
        }
        this.xueNode.width = (this.node.hp/this.allHP)*90
    }

    dieShow(){
        this.unschedule(this.dieShow)
        this.node.opacity = 0
        this.node.active = false
        this.dieNode.active = false;
    }

    
    randomPos() {
        let posX = Math.floor(Math.random()*2668)-2084
        let posY = Math.floor(Math.random()*1500)-1334
        // return cc.v2(500, 375);
        return cc.v2(posX, posY);
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
            this.enemyClear()
        }
        
        // console.log('玩家碰撞');
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * */
    onCollisionStay(other, self){
        if(other.node.name == "player"){
            Observer.emit("eneShow")
            this.enemyClear()
        }
    }

    /** 当碰撞结束后调用 */
    onCollisionExit(other, self){
        if(other.node.name == "player"){
            Observer.emit("eneShow")
            this.enemyClear()
        }
    }

    update (dt) {

    }


}
