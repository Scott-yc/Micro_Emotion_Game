
/**
 * 游戏摄像机
 * @author FJM 2025.07.16
 */
export class GameCamera {
    /**地图节点 */
    private mapNode: cc.Node;
    /**人物节点 */
    private roleNode: cc.Node;
 
    /**地图x轴最大移动距离 */
    private xRange: number;
    /**地图y轴最大移动距离 */
    private yRange: number;
    /**上一次人物X位置 */
    private lastRoleX: number;
    /**上一次人物Y位置 */
    private lastRoleY: number;
 
    /**
     * 构造函数
     * @param viewPortNode 视口节点  例如屏幕大小1334x750
     * @param mapNode      地图节点  2668x1500
     * @param roleNode     人物节点 
     */
    public constructor(viewPortNode: cc.Node, mapNode: cc.Node, roleNode: cc.Node) {
        //保存节点
        this.mapNode = mapNode;
        this.roleNode = roleNode;
        //计算x，y轴最大移动距离
        if (this.mapNode.width > viewPortNode.width) {
            this.xRange = (this.mapNode.width - viewPortNode.width) / 2;
        } else {
            this.xRange = 0;
        }
        if (this.mapNode.height > viewPortNode.height) {
            this.yRange = (this.mapNode.height - viewPortNode.height) / 2;
        } else {
            this.yRange = 0;
        }
        //保存人物位置
        this.lastRoleX = roleNode.x;
        this.lastRoleY = roleNode.y;
 
        // console.log("摄像头最大移动距离:", this.xRange, this.yRange);
    }
 
    /**刷新位置 */
    public updatePosition() {
        //人物未移动，则不需要更新位置
        if (this.lastRoleX == this.roleNode.x && this.lastRoleY == this.roleNode.y) {
            return;
        }
        this.lastRoleX = this.roleNode.x;
        this.lastRoleY = this.roleNode.y
        //人物和地图中点距离
        let distX = this.roleNode.x;
        let distY = this.roleNode.y;
        //地图根据距离反向移动，这样人物就能一直处于视口中间
        this.mapNode.x = -distX;
        this.mapNode.y = -distY;
        //地图边缘检测
        if (this.mapNode.x > this.xRange) {
            this.mapNode.x = this.xRange;
            // console.log("摄像头超过右边界");
        } else if (this.mapNode.x < -this.xRange) {
            this.mapNode.x = -this.xRange;
            // console.log("摄像头超过左边界");
        }
        if (this.mapNode.y > this.yRange) {
            this.mapNode.y = this.yRange;
            // console.log("摄像头超过上边界");
        } else if (this.mapNode.y < -this.yRange) {
            this.mapNode.y = -this.yRange;
            // console.log("摄像头超过下边界");
        }
    }
}