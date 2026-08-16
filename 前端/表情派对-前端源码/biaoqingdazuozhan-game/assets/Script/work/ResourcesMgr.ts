export const ResourcesMgr = new class{
    /**分包名 */
    private packages = ["main/","bundle"];

    /**是否正在加载 */
    private isLoading: boolean = false;

    /**待加载队列 */
    private awaitLoadArr = [];

    /**加载资源 */
    loadRes(packagesIndx: number, path: string, assestType: any, callBack?: Function){
        let self = this;
        if(packagesIndx == 0){
            cc.resources.load(self.packages[packagesIndx] + path, assestType, function(err, assest){
                if(!err && assest){
                    if(callBack){
                        callBack(assest);
                    }
                    self.awaitLoadArr.splice(0,1);
                    self.isLoading = false;
                    self.load();
                }
                else{
                    if(packagesIndx >= self.packages.length - 1){
                        console.log("资源加载失败:" + self.packages[packagesIndx] + path);
                        self.awaitLoadArr.splice(0,1);
                        self.isLoading = false;
                        self.load();
                        return;
                    }
                    self.loadRes(packagesIndx + 1, path, assestType, callBack);
                }
            })
        }
        else{
            cc.assetManager.loadBundle(self.packages[packagesIndx], null, (err, bundle) => {
                if(!err && bundle){
                    bundle.load(path, assestType, (err, assest) => {
                        if(!err && assest){
                            if(callBack){
                                callBack(assest);
                            }
                            cc.assetManager.removeBundle(bundle);
                            self.awaitLoadArr.splice(0,1);
                            self.isLoading = false;
                            self.load();
                        }
                        else{
                            cc.assetManager.removeBundle(bundle);
                            if(packagesIndx >= self.packages.length - 1){
                                console.log("资源加载失败:" + self.packages[packagesIndx] + path);
                                self.awaitLoadArr.splice(0,1);
                                self.isLoading = false;
                                self.load();
                                return;
                            }
                            self.loadRes(packagesIndx + 1, path, assestType, callBack);
                        }
                    })
                }
                else{
                    // console.error("资源加载失败：" + self.packages[packagesIndx]);
                }
            })
        }
    }

    load(){
        if(this.awaitLoadArr.length == 0 || this.isLoading){
            return;
        }
        this.isLoading = true;
        let data = this.awaitLoadArr[0];
        this.loadRes(data[0], data[1], data[2], data[3]);
    }

    /**在所有包里加载 */
    private loadResFormPackage(path: string, assetType: any, callBack?: Function) {
        let indexPackage = 0;
        if(!callBack){
            this.awaitLoadArr.push([indexPackage,path, assetType,null]);
        }
        else{
            this.awaitLoadArr.push([indexPackage,path, assetType,callBack]);
        }
        this.load();
        // this.loadRes(indexPackage, path, assetType, callBack);
    }

    /**加载JSON */
    loadJson(path: string, callBack?: Function){
        this.loadResFormPackage(path,cc.JsonAsset,callBack);
    }
    
    /**缓存图片 */
    private m_mapSpriteFrame: Map<string, cc.SpriteFrame> = new Map();
    /**加载图片 */
    public loadSpriteFrame(path: string, callBack?: Function){
        if(this.m_mapSpriteFrame.has(path)){
            if(callBack){
                callBack(this.m_mapSpriteFrame.get(path));
            }
            return;
        }

        this.loadResFormPackage("texture/" + path,cc.SpriteFrame,(frame)=>{
            if(!frame){
                if(callBack){
                    callBack(null);
                }
                return;
            }

            this.m_mapSpriteFrame.set(path,frame);
            if(callBack){
                callBack(frame);
            }
        })
    }

    /**图片显示 */
    public setImg(imgNode, spriteFrame) {
        imgNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    }

    /**加载网络图片 */
    public loadImgByUrl(imgNode, remoteUrl, imageType) {
        let that = this;
        if (!imageType) {
            imageType = "png";
        }
        cc.loader.load({
            url: remoteUrl,
            type: imageType,
        }, function (err, texture) {
            if (err) {
                return;
            }
            that.setImg(imgNode, new cc.SpriteFrame(texture));
        });
    }

     /**加载微信图片 */
     public setAvatar(avatarUrl: string,aNode:any) {
        if (!avatarUrl) {
            // this.headMc.getComponent(cc.Sprite).spriteFrame = this.defaultAvatar;
            return;
        }
        let image
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            image = wx.createImage();
        }else if(cc.sys.platform == cc.sys.BYTEDANCE_GAME){
            image = tt.createImage();
        }
        
        // image.onerror = e => console.log(e);
        image.onload = () => {
            try {
                    let texture = new cc.Texture2D();
                    // @ts-ignore
                    texture.initWithElement(image);
                    texture.handleLoadedTexture();
                    aNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            } catch (e) {
                console.warn(e);
            }
        };
        image.src = avatarUrl;
    }



    /**加载预制体 */
    public loadPrefab(path: string, callBack: Function){
        // console.log(path + "UUUUUUUUUUUU");
        this.loadResFormPackage("prefab/" + path, cc.Prefab, callBack);
    }

    /**加载分包 */
    public loadSubpackage(name: string){
        return new Promise(res => {
        //     qq.loadSubpackage({
        //         name: name,
        //         success: () => {console.log("分包加载成功：" + name);res()},
        //         fail: () => {console.log("分包加载失败：" + name)}
        //     })
    
        }).then(() => {
            console.log("分包加载成功：" + name);
        }).catch(()=>{
            console.log("分包加载失败：" + name)
        })
    }
}