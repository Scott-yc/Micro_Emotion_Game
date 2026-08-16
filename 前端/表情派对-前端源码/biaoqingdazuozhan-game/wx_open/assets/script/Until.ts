
export function setAvatar(sprite:cc.Sprite, avatarUrl: string) {

    let image = wx.createImage();
    image.onerror = e => console.log(e);
    image.onload = () => {
        try {
            let texture = new cc.Texture2D();
            // @ts-ignore
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            sprite.spriteFrame = new cc.SpriteFrame(texture);

        } catch (e) {
            console.warn(e);
        }
    };
    image.src = avatarUrl;
}

/**
 * 超过三位的以点形式展现
 * @param name
 * @constructor
 */
export function OmitName(name:string){
    let a  = name;
    if(name.length > 4){
        a = name[0] + name[1] + name[2] + name[3] + '...';
    }
    return a;
}


/**
 * 超过三位的以点形式展现
 * @param name
 * @constructor
 */
export function OmitNameThree(name:string){
    let a  = name;
    if(name.length > 3){
        a = name[0] + name[1] + name[2] + '...';
    }
    return a;
}

export function dateToDateString(date: Date = new Date()) {
    console.log(date);
    return `${date.getFullYear()}${padTwo(date.getMonth() + 1)}${padTwo(date.getDate())}`;
}

export function padTwo(s: number) {
    if (s < 10) {
        return '0' + s;
    } else {
        return s;
    }
}

export function getWeekOfYear(weekStartsOn: number = 1): number {
        const date = new Date();
        const year = date.getFullYear();
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000);
        const dayOfWeek = date.getDay();
        const adjustedDays = pastDaysOfYear + (firstDayOfYear.getDay() - weekStartsOn + 7) % 7;
        return Math.floor(adjustedDays / 7) + 1;
    }




