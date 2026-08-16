// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Observer } from "./work/Observer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EnemyFour extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    /**
         * 碰撞处理
         * */
    onCollisionEnter(other, self) {

        // this.collisionEnemy(other, self);

        // if (!this.bThrought){
        // this.node.destroy();
        // }
        if (other.node.name == "player") {
            Observer.emit("eneShow")
            let box = self.node.getComponent(cc.BoxCollider);
            if (box) {
                box.enabled = false;
            }
            self.node.active = false
            if (self.node.name == "Boss4") {//直接消失，不进行分裂
                let ayNode = self.node.parent;
                let enemy = ayNode.getComponent('Boss4');
                enemy.dieBoss4();
            }
        }

        // console.log('玩家碰撞');
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * */
    onCollisionStay(other, self) {
        if (other.node.name == "player") {
            Observer.emit("eneShow")
            let box = self.node.getComponent(cc.BoxCollider);
            if (box) {
                box.enabled = false;
            }
            self.node.active = false
            if (self.node.name == "Boss4") {//直接消失，不进行分裂
                let ayNode = self.node.parent;
                let enemy = ayNode.getComponent('Boss4');
                enemy.dieBoss4();
            }
        }
    }

    /** 当碰撞结束后调用 */
    onCollisionExit(other, self) {
        if (other.node.name == "player") {
            Observer.emit("eneShow")
            let box = self.node.getComponent(cc.BoxCollider);
            if (box) {
                box.enabled = false;
            }
            self.node.active = false
            if (self.node.name == "Boss4") {//直接消失，不进行分裂
                let ayNode = self.node.parent;
                let enemy = ayNode.getComponent('Boss4');
                enemy.dieBoss4();
            }
        }
    }

    update(dt) {

    }
}
