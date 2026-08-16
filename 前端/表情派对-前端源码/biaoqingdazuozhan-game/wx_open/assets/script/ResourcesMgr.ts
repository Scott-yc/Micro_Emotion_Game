export const ResourcesMgr = new class{

     /**加载微信图片 */
     public setAvatar(avatarUrl: string,aNode:any) {
        if (!avatarUrl) {
            // this.headMc.getComponent(cc.Sprite).spriteFrame = this.defaultAvatar;
            return;
        }
        let image = wx.createImage();
       
        image.onerror = e => console.log(e);
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

}