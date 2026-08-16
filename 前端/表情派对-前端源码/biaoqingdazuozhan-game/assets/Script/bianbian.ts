
import { audioConfig, PlayerMessage } from "./config/Config";
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

        let aPos = cc.v2(PlayerMessage.playRoleWZX,PlayerMessage.playRoleWZY)
        this.node.x = this.node.parent.x;
        this.node.y = this.node.parent.y;
        this.node.parent = this.node.parent.parent
        let positionInParent = this.node.getPosition();
        // let positionInParent = this.node.convertToNodeSpaceAR(cc.v2(0, 0));
        // let positionInParent = this.node.convertToNodeSpaceAR(this.node.parent.getPosition())

        // console.log("位置：" + aPos)
        // console.log("B位置：" + positionInParent)
        if(aPos.x==0 && aPos.y==0){
            aPos = cc.v2(100,100)
        }
        let direction = aPos.sub(positionInParent);
        let distance = direction.mag(); // 计算距离
        console.log(distance)
        this.speed = distance/200
        cc.tween(this.node)
            .to(this.speed, { x:aPos.x,y:aPos.y})
            .call(() => {
                // this.node.active = false;
                this.node.destroy();
            })
            .start();
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
        // console.log(other.node);
        // console.log(self.node);
        // console.log("---------------");
        // this.collisionEnemy(other, self);

        // if (!this.bThrought){
            // this.node.destroy();
        // }
        if(other.node.name == "player"){
            Observer.emit("bianbianShow")
            this.enemyClear()
        }
        
        // console.log('玩家碰撞');
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * */
    onCollisionStay(other, self){
        // console.log(other.node);
        // console.log(self.node);
        // console.log("---------------");
        if(other.node.name == "player"){
            // Observer.emit("bianbianShow")
            // this.enemyClear()
        }
    }

    /** 当碰撞结束后调用 */
    onCollisionExit(other, self){
        if(other.node.name == "player"){
            // Observer.emit("bianbianShow")
            // this.enemyClear()
        }
    }



    update (dt) {

    }


}
