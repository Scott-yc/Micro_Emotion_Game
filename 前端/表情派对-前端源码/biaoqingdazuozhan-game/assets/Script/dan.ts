
import { audioConfig, GameFidhtMessage, PlayerMessage } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { ManagerUI } from "./work/ManagerUI";
import { Observer } from "./work/Observer";


const {ccclass, property} = cc._decorator;

@ccclass
export default class bianbian extends cc.Component {


    private speed=3;

    onLoad () {
        
    }


    onEnable () {
        this.setMove();
    }

    setMove(){
        let t = GameFidhtMessage.Fight_Enemy_Elite6_Egg_Time
        this.schedule(this.danClear,t)
    }

    danClear(){
        this.node.active = false
        this.node.destroy();
    }


    enemyType(type:any){
        this.node.type = type
    }

    enemyClear(){
        // this.node.destroy();
        this.node.active = false
    }


    /**
     * 碰撞处理
     * */
    onCollisionEnter (other, self) {
        if(other.node.name == "player"){
            Observer.emit("danShow")
            this.enemyClear()
        }
        
        // console.log('玩家碰撞');
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * */
    onCollisionStay(other, self){
        if(other.node.name == "player"){
            // Observer.emit("danShow")
            // this.enemyClear()
        }
    }

    /** 当碰撞结束后调用 */
    onCollisionExit(other, self){
        if(other.node.name == "player"){
            // Observer.emit("danShow")
            // this.enemyClear()
        }
    }



    update (dt) {

    }


}
