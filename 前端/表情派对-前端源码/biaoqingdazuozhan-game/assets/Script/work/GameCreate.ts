
import { audioConfig, PlayerMessage } from "../config/Config";
import { AudioMgr } from "./AudioMgr";
import { ManagerAD } from "./ManagerAD";
import { ManagerUI } from "./ManagerUI";
import { NetWork } from "./NetWork";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameCreate extends cc.Component {

    onLoad(){
        cc.game.addPersistRootNode(this.node);
        cc.game.setFrameRate(30);

        cc.debug.setDisplayStats(false);
        
        ManagerUI.setRoot(this.node);

        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            PlayerMessage.playToken = ""
            NetWork.getVXCode();
            wx.onShow(()=>{
                // AudioMgr.playBGMusic(audioConfig.BGMusic)
                AudioMgr.resumeBGMusic();
            })
        }else{
            PlayerMessage.playToken = "451af3f5-fdb4-43c9-9c91-ea423baeca43"
        }
        
        
        ManagerUI.openUI("Loading_UI");
        ManagerAD.initAD()
    }
}
