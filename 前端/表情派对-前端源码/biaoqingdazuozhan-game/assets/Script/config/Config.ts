/**当前运行环境 */
export const CurPlatform = {
    /**开发测试环境 */
    GamePlatform: true,
    /**本地测试环境 */
    // GamePlatform: false,
};
/**访问地址 */
export const ApiUrl = {
    /**地址 */
    appUrl: "https://admin.emoparty.com/",//地址
    
};

/**信息配置表 */
export const PlayerMessage = {
    GameZD:true,
    PlayerHeadAdress:"",
    PlayerName:"",
    PlayerAdress:"",
    playerCode:"",
    playDefault:0,
    playToken:"",
    PlaySetUI:false,//玩家是那个页面进入Set
    PlayBulletHurt:[],//玩家子弹伤害
    PlayBulletCurHurt:0,//玩家子弹当前伤害
    PlayBulletRange:[],//玩家子弹宽度
    PlayMonster:[],//怪物信息
    PlayVideoScore:0,//玩家观看视频获得的积分
    PlayStoreNum:0,//玩家存活1天获得晶石数量
    PlayScoreNum:0,//玩家存活1天获得积分数量
    playGameID:0,//挑战的游戏ID
    playGameTimerNum:0,//游戏时长
    playGameResurrectionNum:0,//复活次数
    playGameSkinID:0,//玩家皮肤ID
    playGameScoreNum:0,//玩家金币总数
    playGameStoreNum:0,//玩家彩石总数
    playRoleWZX:0,//坐标
    playRoleWZY:0,//坐标
    playHYZY:false,//好友子域
    playStop:false,//暂停控制
    playKlArr:[],//骷髅数组
    PlayerMaxDay:0,//最大天数
    isPlayingName:"",//
    PlayerResurrection:0,//最大复活次数,
}



/**排行榜信息*/
export const rankMessageArr = [];


/**正常好友排行榜信息*/
export const miaoRankPREList = [];


//游戏角色怪物属性
export const GameFidhtMessage = {
    Fight_Play_Blood:5,//主角血量
    Fight_Play_Move:8,//主角移动速度
    Fight_Play_Invincible:5,//主角受伤无敌时间
    Fight_Enemy_Small_Time:3,//小怪出生时间
    Fight_Enemy_Middle_Time:5,//精英怪出生时间
    Fight_Enemy_Big_Time:3,//BOSS怪出生时间 天
    Fight_Enemy_Small_Monster:[],//普通怪属性
    Fight_Enemy_Middle_Monster:[],//精英怪属性
    Fight_Enemy_Big_Monster:[],//boss怪属性
    Fight_Enemy_Elite6_Stop_Time:3,//机器人发动技能停留时间
    Fight_Enemy_Elite6_Egg_Time:3,//机器人下的蛋停留时间
    Fight_Enemy_Elite6_Interval_Time:3,//机器人发动技能间隔时间
    Fight_Enemy_Elite9_Reduce_Time:3,//恐龙技能玩家射速降低时间
} 



export const fxhttpArrWX=[]


export const shopListArr=[]//商城列表

/**音效配置表 */
export const audioConfig = {
    /**主页背景音乐 */
    BGMusic: "audio/sd/游戏主页背景音乐",
    /**游戏中背景音乐 */
    ZDSD: "audio/sd/游戏中背景音乐",
    /**排行榜背景音乐 */
    rankBgSD: "audio/sd/排行榜背景音乐",
    /**商城背景音乐 */
    shopBgSD: "audio/sd/商城背景音乐",
    /**失败 */
    lose: "audio/sd/游戏失败音效",
    /**按钮点击 */
    btnClick: "audio/sd/点击音效",
    /**升级 */
    gold: "audio/sd/gold",
    /**boss出现音效 */
    bossShowSD: "audio/sd/boss出现音效",
    /**怪物死亡音效 */
    emenyDieSD: "audio/sd/怪物死亡音效",
    

    /**云朵设计音效 */
    YDSD: "audio/sd/云朵设计音效",
    /**boss出现音效 */
    XZSD: "audio/sd/小猪射击音效",
    /**小猫射击音效 */
    XMSD: "audio/sd/小猫射击音效",
    /**小狗射击音效 */
    XGSD: "audio/sd/小狗射击音效",
    /**兔子射击音效 */
    TZSD: "audio/sd/兔子射击音效",
    /**酸雨射击音效 */
    SYSD: "audio/sd/酸雨射击音效",
    /**闪电射击音效 */
    SDSD: "audio/sd/闪电射击音效",
    /**boss出现音效 */
    JQRSD: "audio/sd/机器人射击音效",
    /**彩虹射击音效 */
    CHSD: "audio/sd/彩虹射击音效",
    /**UFO射击音效 */
    UFOSD: "audio/sd/UFO射击音效",

}