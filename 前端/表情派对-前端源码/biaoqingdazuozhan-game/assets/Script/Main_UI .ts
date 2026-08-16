
import { audioConfig } from "./config/Config";
import { AudioMgr } from "./work/AudioMgr";
import { ManagerUI } from "./work/ManagerUI";
import { Message, MessageType } from "./work/Message";
import { NetWork } from "./work/NetWork";
import { Observer } from "./work/Observer";
// import * as dpbt from './work/aabb.js';


const {ccclass, property} = cc._decorator;

@ccclass
export default class Main_UI extends cc.Component {


    onLoad(){
    }

    onEnable(){
        ManagerUI.closeUI("Loading_UI");
        this.init();
    }
 

    onDestroy(){
        Observer.off('bgAduio') 
    }

    update(dt){
    }

    //初始化
    private init(){
        console.log('Main')
        
        // NetWork.getPlayerMessage((bool,res,msg)=>{
        //     if(bool){
                
        //         MessageConfig.playerID = res.user.id + "";
        //     }
        //     // level
        // })
        // NetWork.getPeiZhiMessage("1",(bool,res,msg)=>{
        //     if(bool){

        //     }
        //     // level
        // })
        
        this.playBgMusic()
        
        
    }

    loginShow(){
    }
    
    /**播放背景音乐 */
    playBgMusic(){
        AudioMgr.playBGMusic(audioConfig.BGMusic);
    }

    /**微信登录 */
    playVxLogin(){
        console.log("--------------------")
        AudioMgr.playAudioEffect(audioConfig.btnClick);
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            
        }else[
            ManagerUI.openUI("Home_UI")
        ]
        
    }

}
