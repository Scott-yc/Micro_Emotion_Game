import { AudioMgr } from "./work/AudioMgr";
import { GameDataTable } from "./work/GameDataTable";
import { ManagerUI } from "./work/ManagerUI";
import { NetWork } from "./work/NetWork";
import { ResourcesMgr } from "./work/ResourcesMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading_UI extends cc.Component {
    @property({
        type: cc.Sprite,
        tooltip: "进度条",
    })
    loadSlider: cc.Sprite = null
    /**加载速度 */
    private speed:number = 0.01;
    /**当前进度 */
    private curRange: number = 0;

    private jdBool:Boolean = false

    /**是否加载 */
    private loadBool:Boolean = false;

    onLoad(){
        this.node.zIndex = 9;
    }

    onEnable(){
        this.loadSlider.fillRange = 0;
        this.curRange = 0;
        setTimeout(() => {
            this.atr();
        }, 500);
    }

    atr(){
        ResourcesMgr.loadPrefab("Home_UI",function(){ })
        ResourcesMgr.loadPrefab("Shop_UI",function(){ })
    }


    update(dt){
        if(!this.loadBool){
            this.curRange += this.speed;
            if(this.curRange >= 1){
                this.curRange = 1;
            }
            this.loadSlider.fillRange = this.curRange;
            if(this.curRange >= 1){
                ManagerUI.openUI("Main_UI");
                if(cc.sys.platform == cc.sys.WECHAT_GAME){
                    // NetWork.wxGetUserInfo();
                    console.log("微信")
                    NetWork.wxGetUserInfo()
                    wx.showShareMenu({
                        withShareTicket: true,
                        menus: ['shareAppMessage', 'shareTimeline']
                    })
                    wx.onShareAppMessage(function () {
                        return {
                            title: '你敢和我一起来挑战吗',
                        //   imageUrlId: id,
                        //   imageUrl: url
                        }
                    })
                }else if(cc.sys.platform == cc.sys.BYTEDANCE_GAME){
                    console.log("字节")
                    // NetWork.openUserAuthorize();
                    tt.showShareMenu({
                        withShareTicket: true,
                        menus: ['shareAppMessage', 'shareTimeline']
                    })
                    tt.onShareAppMessage(function () {
                        return {
                            title: '你敢和我一起来挑战吗',
                        //   imageUrlId: id,
                        //   imageUrl: url
                        }
                    })
                }
                this.loadBool = true;
                GameDataTable.loadData()
                AudioMgr.setMusicVolume(0.3);
                AudioMgr.setEffectVolume(0.5);
                this.curRange = 0;
                
                
                
            }
        }
        
    }


}
