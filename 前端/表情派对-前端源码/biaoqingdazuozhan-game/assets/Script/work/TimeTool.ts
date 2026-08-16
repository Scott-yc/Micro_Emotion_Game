export const TimeTool = new class{
    /**获取当前时间  精确到 天 */
    public getCurDataByDay(){
        let myDate = new Date();
        let year = myDate.getFullYear().toString();
        let mon = (myDate.getMonth() + 1).toString();
        let day = myDate.getDate().toString();
        if(mon.length == 1){
            mon = "0" + mon;
        }
        if(day.length == 1){
            day = "0" + day;
        }
        let date = year + mon + day;
        return Number(date);
    }

    /**获取当前时间  精确到 小时 */
    public getCurDataByHour(){
        let myDate = new Date();
        let year = myDate.getFullYear().toString();
        let mon = (myDate.getMonth() + 1).toString();
        let day = myDate.getDate().toString();
        let hour = myDate.getHours().toString();
        if(mon.length == 1){
            mon = "0" + mon;
        }
        if(day.length == 1){
            day = "0" + day;
        }
        if(hour.length == 1){
            hour = "0" + hour;
        }
        let date = year + mon + day + hour;
        return Number(date);
    }

    /**获取当前时间  精确到 分钟 */
    public getCurDataByMin(){
        let myDate = new Date();
        let year = myDate.getFullYear().toString();
        let mon = (myDate.getMonth() + 1).toString();
        let day = myDate.getDate().toString();
        let hour = myDate.getHours().toString();
        let min = myDate.getMinutes().toString();
        if(mon.length == 1){
            mon = "0" + mon;
        }
        if(day.length == 1){
            day = "0" + day;
        }
        if(hour.length == 1){
            hour = "0" + hour;
        }
        if(min.length == 1){
            min = "0" + min;
        }
        let date = year + mon + day + hour + min;
        return Number(date);
    }

    /**获取当前时间  精确到 秒 */
    public getCurDataBySeconnd(){
        let myDate = new Date();
        let year = myDate.getFullYear().toString();
        let mon = (myDate.getMonth() + 1).toString();
        let day = myDate.getDate().toString();
        let hour = myDate.getHours().toString();
        let min = myDate.getMinutes().toString();
        let second = myDate.getSeconds().toString();
        if(mon.length == 1){
            mon = "0" + mon;
        }
        if(day.length == 1){
            day = "0" + day;
        }
        if(hour.length == 1){
            hour = "0" + hour;
        }
        if(min.length == 1){
            min = "0" + min;
        }
        if(second.length == 1){
            second = "0" + second;
        }
        let date = year + mon + day + hour + min + second;
        return Number(date);
    }

    getWeekOfYear(weekStartsOn: number = 1): number {
        const date = new Date();
        const year = date.getFullYear();
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000);
        const dayOfWeek = date.getDay();
        const adjustedDays = pastDaysOfYear + (firstDayOfYear.getDay() - weekStartsOn + 7) % 7;
        return Math.floor(adjustedDays / 7) + 1;
    }
    
    public getCurTimeSeconnd(){
        let myDate = new Date();
        let time = myDate.getTime()
        let ti = Math.floor(time/1000);
        return Number(ti);
    }
}