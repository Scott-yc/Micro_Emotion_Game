// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { audioConfig, PlayerMessage } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    @property({
        type: cc.SpriteFrame,
        tooltip: "子弹皮肤"
    })
    private bulletSkin: cc.SpriteFrame[] = [];


    // LIFE-CYCLE CALLBACKS:

    private x = 0;
    private y = 0;
    private distance = 0;
    private angle = 0;
    private radians = 0

    private moveBool = false;

    private skinID=0

    onLoad () {
        
    }

    onEnable () {
        this.node.getComponent(cc.BoxCollider).size.width = this.node.width;
        this.node.getComponent(cc.BoxCollider).size.height = this.node.height;
        this.skinID = PlayerMessage.playGameSkinID-1;
        // this.skinID = 10;//测试
        this.node.getComponent(cc.Sprite).spriteFrame = this.bulletSkin[this.skinID];
    }

    angleShow(cd){
        // console.log("cd:" + cd)
        switch (this.skinID) {
            case 0:
                this.node.angle = cd+210;
                break;
            case 1:
                this.node.angle = cd+215;
                break;
            case 2:
                this.node.angle = cd-112;
                break;
            case 3:
                this.node.angle = cd-90;
                break;
            case 4:
                this.node.angle = cd;
                break;
            case 5:
                this.node.angle = cd;
                break;
            case 6:
                this.node.angle = cd-130;
                break;
            case 7:
                this.node.angle = cd-130;
                break;
            case 8:
                this.node.angle = cd-120;
                break;
            case 9:
                this.node.angle = cd-90;
                break;
            case 10:
                this.node.angle = cd;
                break;
        
            default:
                break;
        }
        
    }

    /** 让子弹飞 */
    // fly(dir:cc.Vec2, distance:number, speed:number){
    fly(aey:any,dir:cc.Vec2,cd:any, sd:any){
        // let az = cd
        // this.x = dir.x;
        // this.y = dir.y;
        // this.distance = 10;
        // this.radians = az * Math.PI / 180;
        // this.moveBool = true;
        // this.node.setPosition(aey)
        
        let az = cd-270;
        // console.log("更新后C：" + az)
        var center = {x:dir.x,y:dir.y}; //圆心坐标
        var radius = 2000; //半径
        var hudu = (2*Math.PI / 360) * az; //弧度
        var X = center.x + Math.sin(hudu) * radius; //求出x坐标
        var Y = center.y - Math.cos(hudu) * radius; //求出y坐标
        let au = cc.v3(X,Y)
        let direction = au.sub(aey);
        // console.log(direction)
        let distance = direction.mag(); // 计算距离
        // console.log(direction)
        sd = (distance/400)
        // console.log(sd)
        // console.log("------------------")
        this.node.setPosition(aey)
        cc.tween(this.node)
            .to(sd, { x:X,y:Y})
            .call(() => {
                // this.node.active = false;
                this.node.destroy();
            })
            .start();

    }

    


    update (dt) {
        if(this.moveBool){
            this.x += this.distance * Math.cos(this.radians);
            this.y += this.distance * Math.sin(this.radians);
            this.node.setPosition(cc.v2(this.x,this.y))
        }
        
    
    // console.log("新位置:", { x: newX, y: newY });
    }

    /**
     * 当碰撞产生的时候调用
     *  */
    protected collisionEnemy(other, self){
        // console.log(other.node.name)
        if(other.node.name == "boss0-1"){
            let ayNode = other.node;
            let enemy = ayNode.getComponent('EnemyTwo');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "boss0-2"){
            let ayNode = other.node;
            let enemy = ayNode.getComponent('EnemyTwo');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "boss0-3"){
            let ayNode = other.node;
            let enemy = ayNode.getComponent('EnemyTwo');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "boss0-4"){
            let ayNode = other.node;
            let enemy = ayNode.getComponent('EnemyTwo');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "Boss0"){
            let enemy = other.node.getComponent('EnemyThree');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "Boss1"){
            let enemy = other.getComponent('Boss1');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "Boss2"){
            let enemy = other.getComponent('Boss2');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "Boss3"){
            let enemy = other.getComponent('Boss3');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "boss4-1"){
            let ayNode = other.node.parent.parent;
            let enemy = ayNode.getComponent('Boss4');
            /** 扣血 */
            enemy.enemyXiaoZuoHP();
        }else if(other.node.name == "boss4-2"){
            let ayNode = other.node.parent.parent;
            let enemy = ayNode.getComponent('Boss4');
            /** 扣血 */
            enemy.enemyXiaoYouHP();
        }else if(other.node.name == "Boss4"){
            let ayNode = other.node.parent;
            let enemy = ayNode.getComponent('Boss4');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "Boss5"){
            let enemy = other.getComponent('Boss5');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "Boss6"){
            let enemy = other.getComponent('Boss6');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "Boss7"){
            let enemy = other.getComponent('Boss7');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "Boss8"){
            let enemy = other.getComponent('Boss8');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "Boss9"){
            let enemy = other.getComponent('Boss9');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "Enemy"){
            let enemy = other.getComponent('Enemy');
            /** 扣血 */
            enemy.enemyHP();
        }else if(other.node.name == "BossDa"){
            let enemy = other.getComponent('BossDa');
            /** 扣血 */
            enemy.enemyHP();
        }
        
        
        
        // /** 飘血效果 */
        // let damage = this.hurt;
        // if (damage > 0){
        //     enemy.hp -= damage;
        // }
    }

    /**
     * 碰撞处理
     * */
    onCollisionEnter (other, self) {

        this.collisionEnemy(other, self);

        // if (!this.bThrought){
            this.node.destroy();
        // }

        // console.log('子弹碰撞');
    }

    /**
     * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * */
    onCollisionStay(other, self){

    }

    /** 当碰撞结束后调用 */
    onCollisionExit(other, self){

    }
}
