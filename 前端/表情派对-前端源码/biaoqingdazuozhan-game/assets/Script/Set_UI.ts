import { audioConfig, PlayerMessage } from "./config/Config";
import Tip_UI from "./Tip_UI";
import { AudioMgr } from "./work/AudioMgr";
import { GameDataTable, GameData_Type } from "./work/GameDataTable";
import { ManagerAD } from "./work/ManagerAD";
import { ManagerUI } from "./work/ManagerUI";
import { Observer } from "./work/Observer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Set_UI extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: "音乐"
    })
    private musicBtn: cc.Node[] = [];

    @property({
        type: cc.Node,
        tooltip: "音效"
    })
    private effBtn: cc.Node[] = [];

    @property({
        type: cc.Node,
        tooltip: "震动"
    })
    private zdBtn: cc.Node[] = [];

    @property({
        type: cc.Node,
        tooltip: "退出游戏按钮"
    })
    private backBtn: cc.Node = null;

    @property({
        type: cc.Node,
        tooltip: "继续游戏按钮"
    })
    private jxBtn: cc.Node = null;


    private musicBool:boolean = false;
    private effBool:boolean = false;
    private zdBool:boolean = false;

    onLoad () {
       this.node.zIndex = 6;
    }

    onEnable(){
        // ManagerAD.showInterstitialAd()
        this.musicBool =  GameDataTable.getDataType(GameData_Type.IsAudio_BG);
        this.effBool =  GameDataTable.getDataType(GameData_Type.IsAudio_Eff);
        // this.zdBool =  GameDataTable.getDataType(GameData_Type.IsZhen_Dong);
        if(this.musicBool){
            this.musicBtn[0].active = true;
            this.musicBtn[1].active = false;
        }else{
            this.musicBtn[0].active = false;
            this.musicBtn[1].active = true;
        }
        if(this.effBool){
            this.effBtn[0].active = true;
            this.effBtn[1].active = false;
        }else{
            this.effBtn[0].active = false;
            this.effBtn[1].active = true;
        }
        if(PlayerMessage.GameZD){
            this.zdBtn[0].active = true;
            this.zdBtn[1].active = false;
        }else{
            this.zdBtn[0].active = false;
            this.zdBtn[1].active = true;
        }
        // if(this.zdBool){
            // this.zdBtn[0].active = true;
            // this.zdBtn[1].active = false;
            // PlayerMessage.GameZD = true;
        // }else{
        //     this.zdBtn[0].active = false;
        //     this.zdBtn[1].active = true;
        //     PlayerMessage.GameZD = false;
        // }
        if(PlayerMessage.PlaySetUI){
            this.backBtn.active = true;
            this.jxBtn.active = true;
        }else{
            this.backBtn.active = false;
            this.jxBtn.active = false;
        }
    }


    // update (dt) {}

    /**关闭设置页面 */
    private closeClk(){
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        // Observer.emit("gameStop")
        ManagerUI.closeUI("Set_UI")
        if (ManagerUI.judgeShowUI("Fight_UI")) {
            console.log('继续游戏')
            Observer.emit("gameStop")
        }
        else{
            console.log('主页设置')
        }
    }

    /**打开音乐 */
    private openMusicClick(){
        let mu =  GameDataTable.getDataType(GameData_Type.IsAudio_BG);
        if(!mu){
            GameDataTable.setDataType(GameData_Type.IsAudio_BG, true);
            this.musicBtn[0].active = true;
            this.musicBtn[1].active = false;
            AudioMgr.resumeBGMusic();
        }
        else{
            GameDataTable.setDataType(GameData_Type.IsAudio_BG, false);
            this.musicBtn[0].active = false;
            this.musicBtn[1].active = true;
            AudioMgr.pauseBGMusic();
        }
    }

    /**打开音效 */
    private openEffClick(){
        let tu =  GameDataTable.getDataType(GameData_Type.IsAudio_Eff);
        if(!tu){
            GameDataTable.setDataType(GameData_Type.IsAudio_Eff, true);
            this.effBtn[0].active = true;
            this.effBtn[1].active = false;
            AudioMgr.setEffectVolume(0.8)
        }
        else{
            GameDataTable.setDataType(GameData_Type.IsAudio_Eff, false);
            this.effBtn[0].active = false;
            this.effBtn[1].active = true;
            AudioMgr.setEffectVolume(0)
        }
    }

    /**打开震动 */
    private openZhenDongClick(){
        // let tu =  GameDataTable.getDataType(GameData_Type.IsZhen_Dong);
        if(!PlayerMessage.GameZD){
            // GameDataTable.setDataType(GameData_Type.IsZhen_Dong, true);
            this.zdBtn[0].active = true;
            this.zdBtn[1].active = false;
            PlayerMessage.GameZD = true;
        }
        else{
            // GameDataTable.setDataType(GameData_Type.IsZhen_Dong, false);
            this.zdBtn[0].active = false;
            this.zdBtn[1].active = true;
            PlayerMessage.GameZD = false;
        }
    }

    backHome(){
        AudioMgr.playAudioEffect(audioConfig.btnClick)
        Observer.emit("musicBG")
        ManagerUI.closeUI("Set_UI")
        ManagerUI.closeUI("Fight_UI") 
        ManagerUI.openUI("Home_UI") 
    }

    // wx.vibrateLong({})
}
