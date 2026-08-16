import { TimeTool } from "./TimeTool";

export enum GameData_Type{
    Invalid = 0,
    /**最大通关关卡 */
    PsLv = 1,


    
    /**微信名字 */
    playerName = 200,
    /**微信头像地址 */
    playerAddress = 210,

    /**背景音乐 是否 */
    IsAudio_BG = 220,
    /**音效 是否 */
    IsAudio_Eff = 230,

    /**震动 是否 */
    IsZhen_Dong= 240,

    /**玩家Token */
    appToken = 1000,
}



export const GameDataTable = new class{
    /**游戏数据 */
    private mapGameData: Map<GameData_Type,any> = new Map();

    /**获取数据 */
    public getDataType(eType: GameData_Type){
        if(this.mapGameData.has(eType)){
            return this.mapGameData.get(eType);
        }
    }
    /**设置数据 */
    public setDataType(eType: GameData_Type, vaule){
        this.mapGameData.set(eType,vaule);
        let str = this.mapToJson(this.mapGameData);
        localStorage.setItem("GameData", str);
    }
    /**叠加数据 */
    public addDataType(eType: GameData_Type, vaule: any, max?: any){
        let v = vaule;
        if(this.mapGameData.has(eType)){
            v = this.mapGameData.get(eType) + vaule;
        }
        if(max){
            v = Math.min(v,max);
        }
        
        this.mapGameData.set(eType, v);
        let str = this.mapToJson(this.mapGameData);
        localStorage.setItem("GameData", str);
    }
    /**减少数据 */
    public subDataType(eType: GameData_Type, vaule: any, min?: any){
        let v = vaule;
        if(this.mapGameData.has(eType)){
            v = this.mapGameData.get(eType) - vaule;
        }
        if(min){
            v = Math.max(v,min);
        }
        
        this.mapGameData.set(eType, v);
        let str = this.mapToJson(this.mapGameData);
        localStorage.setItem("GameData", str);
    }

    /**加载本地数据 */
    public loadData(){
        let strData = localStorage.getItem("GameData");
        if(strData && strData.length > 0){
            this.mapGameData = this.jsonToMap(strData);
            // this.setDataByType(GameData_Type.isPlayGo, false);
            // this.setDataByType(GameData_Type.boxGoldNum, 0);
            // this.setDataType(GameData_Type.CLife, 200);
            // this.setDataType(GameData_Type.BuildLv, 5);
            // this.setDataType(GameData_Type.RoleLv, 5);
            this.setDataType(GameData_Type.IsZhen_Dong, true);
        }
        else{
            /**初始化数据 */
            this.setDataType(GameData_Type.PsLv, 0);
            this.setDataType(GameData_Type.playerName, "");
            this.setDataType(GameData_Type.playerAddress, "");
            this.setDataType(GameData_Type.IsAudio_BG, true);
            this.setDataType(GameData_Type.IsAudio_Eff, true);
            this.setDataType(GameData_Type.IsZhen_Dong, true);
            
        }
    }

    
    /**map转为json */
    private mapToJson(m:Map<any, any>){
        let obj = Object.create(null);
        m.forEach((v, k)=>{
            obj["" + k] = v;
        })
        return JSON.stringify(obj);
    }
    /**json转为map */
    private jsonToMap(jsonStr){
        let str = JSON.parse(jsonStr);
        let strMap = new Map();
        for(let k of Object.keys(str)){
            strMap.set(Number(k),str[k]);
        }
        return strMap;
    }
}