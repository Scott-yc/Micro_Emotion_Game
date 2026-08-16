
import { audioConfig, GameFidhtMessage, PlayerMessage } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { ManagerUI } from "./work/ManagerUI";
import { Observer } from "./work/Observer";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Boss1 extends cc.Component {

    @property({ type: cc.Node, tooltip: "血条" })
    xueNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "die" })
    dieNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "血" })
    xueBGNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "主角" })
    zjNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "血区域" })
    xueQuNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "灰血条" })
    xuehuiNode: cc.Node = null;

    private allHP=0;
    private subHP=0;
    private ming = 2
    private ctw
    private ctBool = false;

    onLoad () {

    }

    onEnable () {
        this.dieNode.active = false;
        this.xueQuNode.active = false;
        this.xueNode.active = true;
        this.zjNode.opacity = 255;
        this.ctBool = false;
        this.ming = 2;
    }

    sethp(hp:any,shp:any,pos:any){
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
        if(this.ctBool){
            this.xuehuiNode.width = (this.node.hp/this.allHP)*130
        }else{
            this.xueNode.width = (this.node.hp/this.allHP)*130
        }
        if(this.node.hp <= 0){
            let an = this.node.getPosition()
            this.node.hp = 0;
            this.xueNode.width = 0;
            this.node.getComponent(cc.BoxCollider).enabled = false;
            if(this.ming <= 0){
                // console.log("+++++++++++++++++++")
                this.ctw.stop();
                this.zjNode.opacity = 255
                cc.tween(this.zjNode)
                .to(0.2, { opacity: 0 })
                .to(0.2, { opacity: 255 })
                .to(0.2, { opacity: 0 })
                .call(() => {
                    // this.node.active = false
                    let skinID = PlayerMessage.playGameSkinID-1;
                    // cc.audioEngine.stopAllEffects()
                    if(skinID == 4 || skinID == 6){
                        AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD,0.2)
                    }else{
                        AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD,0.5)
                    }
                    this.xueQuNode.active = false;
                    this.node.getComponent(cc.Sprite).spriteFrame = null;
                    this.zjNode.opacity = 0
                    this.dieNode.active = true;
                    this.schedule(this.dieShow,0.5)
                    Observer.emit("upEliteScore",this.node.type)
                })
                .start();
                return
            }else if(this.ming == 2){
                this.ctBool = true;
                this.ming = 0;
                this.zjNode.opacity = 30;
                this.node.hp = this.allHP;
                this.node.getComponent(cc.BoxCollider).enabled = true;
                this.xueNode.active = false;
                this.xueQuNode.active = true;
                this.ctw = cc.tween(this.zjNode)
                .to(3, { opacity: 255 })
                .call(() => {
                    // console.log("------------------")
                    this.ctBool = false;
                    this.xueQuNode.active = false;
                    this.xueNode.active = true;
                    this.zjNode.opacity = 255;
                    this.node.hp = this.allHP;
                    this.xueNode.width = (this.node.hp/this.allHP)*130
                    this.node.getComponent(cc.BoxCollider).enabled = true;
                    
                })
                .start();
            }
        }
    }

    dieShow(){
        this.unschedule(this.dieShow)
        this.zjNode.opacity = 0;
        this.node.active = false;
        this.dieNode.active = false;
    }
    
    randomPos () {
        let a1 = Math.floor(Math.random()*4)
        let posX
        let posY
        if(a1 == 0){
            posX = 0-(Math.floor(Math.random()*300))-1334
            posY = Math.floor(Math.random()*1800)-900
        }else if(a1 == 1){
            posX = Math.floor(Math.random()*300)+1334
            posY = Math.floor(Math.random()*1800)-900
        }else if(a1 == 2){
            posX = Math.floor(Math.random()*2968)-1484
            posY = 0-(Math.floor(Math.random()*300))-750
        } else if(a1 == 3){
            posX = Math.floor(Math.random()*2968)-1484
            posY = Math.floor(Math.random()*300)+750
        }
        // return cc.v2(500, 375);
        return cc.v2(posX, posY);
    }

    fuhuo(){

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

    enemyTwo(type){
        
        this.allHP = Number(GameFidhtMessage.Fight_Enemy_Small_Monster[type].blood) *3;
        this.node.hp = this.allHP;
        this.xueNode.width = (this.node.hp/this.allHP)*90
    }

    enemyFive(type){
        
    }

    update (dt) {

    }


}
