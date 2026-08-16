import { PlayerMessage } from "../config/Config";
import { GameData_Type, GameDataTable } from "./GameDataTable";


export const AudioMgr = new class{

    /**音效缓存 */
    private m_mapAudio: Map<string, cc.AudioClip> = new Map();
    /**正在播放的背景音乐 */
    private isPlayingName: string = null;
    /**音量 */
    private curVolume: number = 0.3;

    private curEffectVolume: number = 0.5;

    public setMusicVolume(volume: number){
        this.curVolume = volume;
        cc.audioEngine.setMusicVolume(this.curVolume);
    }
    public setEffectVolume(volume: number){
        this.curEffectVolume = volume;
        cc.audioEngine.setEffectsVolume(this.curEffectVolume);
    }

    /**播放背景音乐 */
    public playBGMusic(path: string){
        if(path == PlayerMessage.isPlayingName){
            this.resumeBGMusic();
            return;
        }
        PlayerMessage.isPlayingName = path;
        cc.audioEngine.stopMusic();
        if(this.m_mapAudio.has(path)){
            cc.audioEngine.playMusic(this.m_mapAudio.get(path), true);
            cc.audioEngine.setMusicVolume(0.5);
            
            let isAudio = GameDataTable.getDataType(GameData_Type.IsAudio_BG);
            if(!isAudio){
                this.pauseBGMusic();
            }
            return;
        }
        else{
            cc.assetManager.loadAny
            cc.loader.loadRes(path, cc.AudioClip,(err,audio) => {
                if(!err && audio){
                    this.m_mapAudio.set(path,audio);
                    cc.audioEngine.playMusic(audio,true);
                    cc.audioEngine.setMusicVolume(0.5);
                    let isAudio = GameDataTable.getDataType(GameData_Type.IsAudio_BG);
                    if(!isAudio){
                        this.pauseBGMusic();
                    }
                }
                else{
                    // console.error("加载背景音乐失败：" + err + " path:" + path);
                }
            })
            // cc.assetManager.loadBundle("remote/bundle", null, (err, bundle) => {
            //     console.log(bundle)
            //     console.log(err)
            //     if(!err && bundle){
            //         console.log(path)
            //         let pa = bundle.base+path;
            //         console.log(pa)
            //         bundle.load(path, cc.AudioClip,(err, audio) => {
            //             console.log(audio)
            //             console.log(err)
            //             if(!err && audio){
            //                 this.m_mapAudio.set(path,audio);
            //                 cc.audioEngine.playMusic(audio,true);
            //                 cc.audioEngine.setMusicVolume(this.curVolume);
            //                 let isAudio = GameDataTable.getDataType(GameData_Type.IsAudio_BG);
            //                 if(!isAudio){
            //                     this.pauseBGMusic();
            //                 }
            //             }
            //             else{
            //                 console.error("加载背景音乐失败：" + err + " path:" + path);
            //             }
            //         })
            //     }
            //     else{
            //         // console.error("资源加载失败：" + self.packages[packagesIndx]);
            //     }
            // })
        }
    }
    /**停止播放背景音乐 */
    stopBgMusic(){
        cc.audioEngine.stopMusic();
        this.isPlayingName = null;
    }
    /**暂停播放背景音乐 */
    public pauseBGMusic(){
        cc.audioEngine.setMusicVolume(0.5);
        cc.audioEngine.pauseMusic();
    }
    /**恢复播放背景音乐 */
    public resumeBGMusic(){
        let isAudio = GameDataTable.getDataType(GameData_Type.IsAudio_BG);
        if(!isAudio){
            return;
        }
        cc.audioEngine.resumeMusic();
    }

    /**播放音效 */
    public playAudioEffect(path: string){
        let isAudio = GameDataTable.getDataType(GameData_Type.IsAudio_Eff);
        if(!isAudio){
            return;
        }
        if(this.m_mapAudio.has(path)){
            cc.audioEngine.playEffect(this.m_mapAudio.get(path), false);
            cc.audioEngine.setEffectsVolume(0.5);
            return;
        }
        else{
            cc.loader.loadRes(path,cc.AudioClip,(err,audio) => {
                if(!err && audio){
                    this.m_mapAudio.set(path,audio);
                    cc.audioEngine.playEffect(audio,false);
                    cc.audioEngine.setEffectsVolume(1);
                }
                else{
                    // console.error("加载音效失败：" + err + " path:" + path);
                }
            })
        }
    }


    /**播放音效 */
    public playAudioEffect2(path: string){
        let isAudio = GameDataTable.getDataType(GameData_Type.IsAudio_Eff);
        if(!isAudio){
            return;
        }
        if(this.m_mapAudio.has(path)){
            cc.audioEngine.playEffect(this.m_mapAudio.get(path), false);
            cc.audioEngine.setEffectsVolume(0.9);
            return;
        }
        else{
            cc.loader.loadRes(path,cc.AudioClip,(err,audio) => {
                if(!err && audio){
                    this.m_mapAudio.set(path,audio);
                    cc.audioEngine.playEffect(audio,false);
                    cc.audioEngine.setEffectsVolume(0.9);
                }
                else{
                    // console.error("加载音效失败：" + err + " path:" + path);
                }
            })
        }
    }

    /**播放音效 */
    public playAudioEffect3(path: string,bool:boolean){
        let isAudio = GameDataTable.getDataType(GameData_Type.IsAudio_Eff);
        if(!isAudio){
            return;
        }
        if(this.m_mapAudio.has(path)){
            cc.audioEngine.playEffect(this.m_mapAudio.get(path), bool);
            cc.audioEngine.setEffectsVolume(1);
            return;
        }
        else{
            cc.loader.loadRes(path,cc.AudioClip,(err,audio) => {
                if(!err && audio){
                    this.m_mapAudio.set(path,audio);
                    cc.audioEngine.playEffect(audio,bool);
                    cc.audioEngine.setEffectsVolume(1);
                }
                else{
                    // console.error("加载音效失败：" + err + " path:" + path);
                }
            })
        }
    }

    /**播放音效 */
    public playAudioEffect4(path: string){
        let isAudio = GameDataTable.getDataType(GameData_Type.IsAudio_Eff);
        if(!isAudio){
            return;
        }
        if(this.m_mapAudio.has(path)){
            cc.audioEngine.playEffect(this.m_mapAudio.get(path), false);
            cc.audioEngine.setEffectsVolume(1);
            return;
        }
        else{
            cc.loader.loadRes(path,cc.AudioClip,(err,audio) => {
                if(!err && audio){
                    this.m_mapAudio.set(path,audio);
                    cc.audioEngine.playEffect(audio,false);
                    cc.audioEngine.setEffectsVolume(1);
                }
                else{
                    // console.error("加载音效失败：" + err + " path:" + path);
                }
            })
        }
    }

    /**播放音效 */
    public playAudioEffect5(path: string){
        let isAudio = GameDataTable.getDataType(GameData_Type.IsAudio_Eff);
        if(!isAudio){
            return;
        }
        if(this.m_mapAudio.has(path)){
            cc.audioEngine.playEffect(this.m_mapAudio.get(path), false);
            cc.audioEngine.setEffectsVolume(0.5);
            return;
        }
        else{
            cc.loader.loadRes(path,cc.AudioClip,(err,audio) => {
                if(!err && audio){
                    this.m_mapAudio.set(path,audio);
                    cc.audioEngine.playEffect(audio,false);
                    cc.audioEngine.setEffectsVolume(1);
                }
                else{
                    // console.error("加载音效失败：" + err + " path:" + path);
                }
            })
        }
    }

    /**播放音效通用 */
    public playAudioEffectLiu(path: string,volume: number){
        let isAudio = GameDataTable.getDataType(GameData_Type.IsAudio_Eff);
        if(!isAudio){
            return;
        }
        if(this.m_mapAudio.has(path)){
            cc.audioEngine.playEffect(this.m_mapAudio.get(path), false);
            cc.audioEngine.setEffectsVolume(volume);
            return;
        }
        else{
            cc.loader.loadRes(path,cc.AudioClip,(err,audio) => {
                if(!err && audio){
                    this.m_mapAudio.set(path,audio);
                    cc.audioEngine.playEffect(audio,false);
                    cc.audioEngine.setEffectsVolume(volume);
                }
                else{
                    // console.error("加载音效失败：" + err + " path:" + path);
                }
            })
        }
    }
}