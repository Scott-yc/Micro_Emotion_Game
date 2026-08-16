
import { audioConfig, GameFidhtMessage, PlayerMessage } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { Observer } from "./work/Observer";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Boss0 extends cc.Component {

    @property({ type: cc.Node, tooltip: "血条" })
    xueNode: cc.Node = null;

    // @property({ type: cc.Node, tooltip: "小怪" })
    // fenNode: cc.Node[] = [];

    

    @property({ type: cc.Node, tooltip: "die" })
    dieNode: cc.Node[] = [];

    @property({ type: cc.Node, tooltip: "小" })
    xiaoNode: cc.Node = null;

    @property({ type: cc.Prefab, tooltip: "小骷髅" })
    xkl: cc.Prefab = null;

    @property({ type: cc.Node, tooltip: "大" })
    daNode: cc.Node = null;

    @property({ type: cc.Node, tooltip: "愤怒" })
    fnNode: cc.Node = null;

    private allHP=0;

    private banHP = 0;

    private kzBool = false;

    private kbBool = false;

    private klArr = [];

    onLoad () {
        
    }

    onEnable () {
        this.klArr = [];
        let banHP = GameFidhtMessage.Fight_Enemy_Small_Monster[0].blood;
        for (let a = 0; a < 4; a++) {
            //@ts-ignore
            // this.fenNode[a].hp = 0;
            //@ts-ignore
            // this.fenNode[0].type = 0;
            let ai = "boss0-"+(a+1)
            // this.fenNode[0].name = ai;

            let item = cc.instantiate(this.xkl);
            item.name = ai;
            item.hp = 0;
            item.type = 0;
            item.hp = banHP/2;
            this.xiaoNode.addChild(item);
            this.klArr.push(item)
            if(a==0){item.x = -130,item.y = 0}
            if(a==1){item.x = 130,item.y = 0}
            if(a==2){item.x = 0,item.y = 130}
            if(a==3){item.x = 0,item.y = -130}
            item.getComponent(cc.BoxCollider).enabled = false;
        }
        // console.log(this.klArr)
        // this.daNode.hp = 0
        this.daNode.type = 100;
        // this.daNode.move = true;
        this.xiaoNode.opacity = 0;
        this.daNode.name = "Boss0";

        // this.fenNode[0].hp = 0;
        // this.fenNode[1].hp = 0;
        // this.fenNode[2].hp = 0;
        // this.fenNode[3].hp = 0;
        // this.daNode.hp = 0;

        // this.fenNode[0].type = 0;
        // this.fenNode[1].type = 0;
        // this.fenNode[2].type = 0;
        // this.fenNode[3].type = 0;
        // this.daNode.type = 100;

        // this.xiaoNode.opacity = 0;
        
        // this.fenNode[0].name = "boss0-1";
        // this.fenNode[1].name = "boss0-2";
        // this.fenNode[2].name = "boss0-3";
        // this.fenNode[3].name = "boss0-4";
        // this.daNode.name = "Boss0";

        this.dieNode[0].active = false;
        this.dieNode[1].active = false;
        this.dieNode[2].active = false;
        this.dieNode[3].active = false;
        this.dieNode[4].active = false;
        this.fnNode.active = false;
        
        this.kbBool = false;
        // this.banHP = 0;

    }


    circleMove() {
        this.kbBool = true
        this.fnNode.active = true;
        // 先计算弧度
        cc.tween(this.xiaoNode)
            .to(5, { angle: -360 ,opacity:255}, {easing:'quartInOut'})
            .call(() => {
                this.fnNode.active = false;
                for (let a = 0; a < this.xiaoNode.children.length; a++) {
                    this.xiaoNode.children[a].getComponent(cc.BoxCollider).enabled = true;
                }
                this.kbBool = false;
                this.daNode.move = true;
            })
            .start();
    }

    dieShow(){
        this.unschedule(this.dieShow)
        // this.node.active = false;
        console.log("走了没")
        this.dieNode[0].active = false;
        this.fnNode.active = false;
        this.xiaoNode.parent = this.node.parent;
        // for (let a = 0; a < this.klArr.length; a++) {
        //     this.klArr[a].parent=this.node.parent;
        // }
        // this.node.active = false;
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
        let banHP = GameFidhtMessage.Fight_Enemy_Small_Monster[0].blood;
        if(banHP == null || banHP == undefined ){
            banHP = hp/2;
        }
        // this.fenNode[0].hp = banHP;
        // this.fenNode[1].hp = banHP;
        // this.fenNode[2].hp = banHP;
        // this.fenNode[3].hp = banHP;
        // for (let a = 0; a < this.klArr.length; a++) {
        //     this.klArr[a].hp = banHP;
        //     console.log(this.klArr[a].hp)
        // }
        this.daNode.hp = hp;
        this.banHP = hp/2;
        this.kzBool = true;
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
            this.fnNode.active = false;
            this.xueNode.width = 0;
            let aNode = this.node.getChildByName("Boss0")
            aNode.getComponent(cc.BoxCollider).enabled = false;
            cc.tween(aNode)
                .to(0.2, { opacity: 0 })
                .to(0.2, { opacity: 255 })
                .to(0.2, { opacity: 0 })
                .call(() => {
                    aNode.active = false
                    this.fnNode.active = false;
                    let skinID = PlayerMessage.playGameSkinID-1;
                    // cc.audioEngine.stopAllEffects()
                    if(skinID == 4 || skinID == 6){
                        AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD,0.2)
                    }else{
                        AudioMgr.playAudioEffectLiu(audioConfig.emenyDieSD,0.5)
                    }
                    // aNode.opacity = 0;
                    this.dieNode[0].active = true;
                    this.schedule(this.dieShow,0.5)
                    console.log(this.node.type)
                    Observer.emit("upEliteScore",this.node.type)
                    Observer.emit("upEliteScore_0",this.node)
                })
            .start();
            return
        }
        this.xueNode.width = (this.node.hp/this.allHP)*130
    }
    
    // randomPos () {
    //     let a1 = Math.floor(Math.random()*4)
    //     let posX
    //     let posY
    //     if(a1 == 0){
    //         posX = 0-(Math.floor(Math.random()*300))-1334
    //         posY = Math.floor(Math.random()*1800)-900
    //     }else if(a1 == 1){
    //         posX = Math.floor(Math.random()*300)+1334
    //         posY = Math.floor(Math.random()*1800)-900
    //     }else if(a1 == 2){
    //         posX = Math.floor(Math.random()*2968)-1484
    //         posY = 0-(Math.floor(Math.random()*300))-750
    //     } else if(a1 == 3){
    //         posX = Math.floor(Math.random()*2968)-1484
    //         posY = Math.floor(Math.random()*300)+750
    //     }
    //     // return cc.v2(500, 375);
    //     return cc.v2(posX, posY);
    // }

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


    // enemyTwo(type){
    //     this.allHP = Number(PlayerMessage.PlayMonster[type].blood) *3;
    //     this.node.hp = this.allHP;
    //     this.xueNode.width = (this.node.hp/this.allHP)*90
    // }


    


    update (dt) {
        if(this.kzBool){
            let aPos = cc.v2(PlayerMessage.playRoleWZX,PlayerMessage.playRoleWZY)
            let abc = Math.abs(this.node.x-aPos.x)<667
            let def = Math.abs(this.node.y-aPos.y)<375
            if(abc && def){
                this.kzBool = false;
                this.circleMove();
            }
        }

        if(this.kbBool){
            for (let a = 0; a < this.klArr.length; a++) {
                this.klArr[a].angle = -this.xiaoNode.angle;
            }
            // this.fenNode[0].angle = -this.xiaoNode.angle;
            // this.fenNode[1].angle = -this.xiaoNode.angle;
            // this.fenNode[2].angle = -this.xiaoNode.angle;
            // this.fenNode[3].angle = -this.xiaoNode.angle;
        }
    }



}
