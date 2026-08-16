import Tip_UI from "../Tip_UI";
import { AudioMgr } from "./AudioMgr";
import { ManagerUI } from "./ManagerUI";
import { Observer } from "./Observer";


export enum E_ADType {
    /**新人 */
    NewPlay = 0,
    /**成语提示 */
    TipShow = 1,
    /**体力 */
    LifeShow = 2,
    /**体力 */
    TipShowTwo = 3,

}

/**广告管理类 */
export const ManagerAD = new class {

    /**banner广告实例 */
    private bannerAP = null;
    bannerId: string = ''

    /**banner 广告位置 */
    private bannerPos;

    /**激励视频广告 实例 */
    private incentiveAp = null;
    private jlId = "adunit-2d900b932e765ad5";

    /**插屏视频广告 实例 */
    private interstitialAd = null;
    private interstitialId = "adunit-17490f5449d41b5a";

    /**激励视频广告 类型 */
    public incentiveType: E_ADType;

    /**格子视频广告 实例 */
    private gridAp = null;
    // 原生格子: 横向（默认后台90%多格子）
    gridId: string = ''

    /**初始化广告 */
    initAD() {
        this.initIncentiveAD();
        // this.initInterstitialAd()
        // this.initBanner()
    }
    /**初始化 banner广告 */
    initBanner() {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            console.log('横幅广告 不是微信平台')
            return
        }
        if (this.bannerId == '') {
            console.log("请配置横幅广告ID");
            return
        }
        console.log("创建banner广告",this.bannerId);
        let info = window['wx'].getSystemInfoSync();
        this.bannerAP = window['wx'].createBannerAd({
            adUnitId: this.bannerId,
            style: {
                left: 0,
                top: 0,
                width: 350,
            }
        });
        this.bannerAP.onLoad(res => {
            // if(this.bannerPos != null){
            //     let width;
            //     if(info.windowWidth * 0.9 < 300){
            //         width = 300;
            //     }
            //     else{
            //         width = Math.floor(info.windowWidth * 1);
            //     }
            //     let rate = (cc.winSize.height - this.bannerPos) / cc.winSize.height;
            //     let top = info.windowHeight * rate;

            //     this.bannerAP.style.width = width;
            //         this.bannerAP.style.top = info.windowHeight - width * 0.25-35;
            // }
            let width;
            width = Math.floor(info.windowWidth * 1);
            this.bannerAP.style.width = width;
            // this.bannerAP.style.left = 10;
            this.bannerAP.style.top = info.windowHeight - 350 * 0.25 - 35;
            this.bannerAP.show()
                .then(() => {
                    console.log("banner广告 显示成功")
                })
                .catch(err => {
                    console.log("banner广告 显示失败");
                    console.log(err);
                })
        })
        this.bannerAP.onError(err => {
            console.log("banner广告拉取失败：");
            console.log(err);
        })
    }
    /**刷新banner 广告 */
    refreshBanner() {
        console.log("刷新banner广告");
        if (this.bannerAP) {
            this.bannerAP.destroy();
        }
        this.initBanner();
    }
    /**设置banner 位置 */
    setBannerPos(posy: number) {
        this.bannerPos = posy;
    }

    /**初始化 激励视频广告 */
    initIncentiveAD() {
        let that = this;
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            console.log('激励广告 不是微信平台')
            return
        }
        if (this.jlId == '') {
            console.log("请配置激励视频广告ID");
            return
        }
        console.log('激励广告  ',this.jlId)
        if (this.incentiveAp == null) {
            this.incentiveAp = window['wx'].createRewardedVideoAd({
                adUnitId: this.jlId
            });
            this.incentiveAp.onLoad(() => {
                console.log("激励视频 广告加载成功");
            });
            this.incentiveAp.onError((err) => {
                console.log("激励视频广告 加载失败");

            })
        }
        // this.incentiveAp.onClose((res) => {
        //     AudioMgr.resumeBGMusic();
        //     if (!res.isEnded) {
        //         switch (this.incentiveType) {
        //             case E_ADType.NewPlay:
        //                 break;
        //             case E_ADType.TipShow:

        //                 Tip_UI.Instance.tipShow("获得提示次数失败");
        //                 break;
        //             case E_ADType.LifeShow:
        //                 Observer.emit("sbAD");
        //                 break;
        //             case E_ADType.TipShowTwo:

        //                 Tip_UI.Instance.tipShow("获得提示次数失败");
        //                 break;

        //         }
        //         return;
        //     }
        //     switch (this.incentiveType) {
        //         case E_ADType.NewPlay:

        //             Observer.emit('NewPlayAD');
        //             break;
        //         case E_ADType.TipShow:

        //             Observer.emit('adSuccess_TipFill');
        //             break;
        //         case E_ADType.LifeShow:

        //             Observer.emit('lifeAD');
        //             break;
        //         case E_ADType.TipShowTwo:

        //             Observer.emit('ad_TipF');
        //             break;

        //     }

        // })
    }

    /**播放 激励视频 */
    showIncentiveAD(success: any, fail?: any) {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            success && success('模拟激励奖励已发放')
            return
        }
        AudioMgr.pauseBGMusic();
        if (this.incentiveAp) {
            let handler = (res: any) => {
                console.log('关闭广告', res)
                if (res && res.isEnded || res === undefined) {
                    success && success('激励奖励已发放')
                } else {
                    fail && fail('视频播放中断')
                }
                this.incentiveAp.offClose(handler);
            }
            this.incentiveAp.show()
                .then(() => {
                    console.log("激励视频 播放成功");
                    switch (this.incentiveType) {
                        case E_ADType.NewPlay:
                            break;
                        case E_ADType.TipShow:
                            break;
                        case E_ADType.LifeShow:
                            break;
                        case E_ADType.TipShowTwo:
                            break;
                    }
                })
                .catch(err => {
                    this.incentiveAp.load()
                        .then(() => this.incentiveAp.show())
                        .catch(err1 => {
                            Tip_UI.Instance.tipShow("视频获取失败");
                            console.log("激励视频 播放失败");
                            fail && fail('广告展示失败')
                        })
                })
            this.incentiveAp.onClose(handler)
        }
        else {
            success && success('直接发放')
        }
    }

    /**初始化 格子视频广告 */
    gridAD() {
        let that = this;
        // this.gridAp = window['wx'].createGridAd({ adUnitId: 'adunit-1454f6459c574aca',});
        // this.gridAp.onLoad(() => {
        //     console.log("格子视频 广告加载成功");
        // });
        // this.gridAp.onError((err) => {
        //     console.log("格子视频广 加载失败");
        //     Tip_UI.Instance.tipShow("没有广告");

        // }) 
        // this.gridAp.onClose((res) => {
        // }

        this.gridAp = window['wx'].createGridAd({
            adUnitId: 'adunit-1454f6459c574aca',
            adTheme: 'white',
            gridCount: 5,
            style: {
                left: 10,
                top: 76,
                width: 330,
                opacity: 0.8
            }
        })

        this.gridAp.onLoad(() => {
            console.log("格子视频 广告加载成功");
        });
        this.gridAp.onError((err) => {
            console.log("格子视频广 加载失败");
            // Tip_UI.Instance.tipShow("没有广告");

        })
        this.gridAp.onClose((res) => {
        })

        this.gridAp.show()
            .catch(err => console.log(err))
            .then(() => console.log('Grid 广告显示'))
    }

    /**刷新盒子广告 */
    refreshBoxAD() {
        // let boxAD = window['wx'].createAppBox({ adUnitId: "adunit-59338dc0f3f22c5b" });
        // boxAD.load().
        //     then(()=>{
        //         console.log("盒子广告 加载成功");
        //         boxAD.show()
        //             .then(()=>{
        //                 console.log("盒子广告 播放成功");
        //             })
        //             .catch((err)=>{
        //                 console.log("盒子广告 播放失败");
        //                 console.log(err);
        //             })
        //     })
        //     .catch((err)=>{
        //         console.log("盒子广告 加载失败");
        //         console.log(err);
        //     })
    }

    /**看完视频回调*/
    private luckPlayerAD() {
        // Observer.emit("xycuo");
        // NetWork.getLookVideoMessage(2,(res)=>{
        //     if(res){
        //         // Observer.emit("luanniu");
        //     }   
        // })
    }

    /**看完视频回调*/
    private everyPlayerAD() {
        console.log("金币a");
        // NetWork.getLookVideoMessage(1,(res)=>{
        //     if(res){
        //         Observer.emit("everyanniu");

        //     }
        // })
    }

    /**拼团视频回调*/
    private ptPlayerAD() {
        console.log("金币a");
        // NetWork.getLookVideoMessage(1,(res)=>{
        //     if(res){
        //         Observer.emit("ptshow");
        //     }   
        // })
    }

    // 初始化插屏
    initInterstitialAd() {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            console.log('插屏广告 不是微信平台')
            return
        }
        if (this.interstitialId == '') {
            console.log('请配置插屏广告ID')
            return
        }
        console.log('插屏广告 ',this.interstitialId)
        if (this.interstitialAd == null) {
            this.interstitialAd = window['wx'].createInterstitialAd({
                adUnitId: this.interstitialId
            });
            this.interstitialAd.onError((err: any) => {
                console.log('【流量主插屏】初始化有误', err)
            });
        }
    }

    // 插屏展示
    showInterstitialAd() {
        if (cc.sys.platform != cc.sys.WECHAT_GAME) {
            return
        }
        if (this.interstitialAd) {
            this.interstitialAd.show().then(() => {

            }).catch((err: any) => {
                console.log('【流量主插屏】加载失败', err)
            });
        }
    }

}