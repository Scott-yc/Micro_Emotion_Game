
import { ApiUrl, fxhttpArrWX, PlayerMessage, rankMessageArr, shopListArr } from "../config/Config";
import { AudioMgr } from "./AudioMgr";
import MD5 from "./MD5";
import { Message, MessageType } from "./Message";
import { Observer } from "./Observer";
import { ResourcesMgr } from "./ResourcesMgr";
import { ManagerUI } from "./ManagerUI";
import { GameData_Type, GameDataTable } from "./GameDataTable";

/** 网络封装 */
export const NetWork = new class {

    /** 有参数POST接口封装
      * @param url 请求地址
      * @param data 请求参数(会签名)
      * @param callback 回调函数
      */
    noTokenParametersPost(url, param, callback) {
        //2.发起请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    if (response) {
                        var responseJson = JSON.parse(response);
                        if (responseJson.code == 1) {
                            callback(responseJson, responseJson.msg);
                        } else {
                            callback(false, responseJson.msg);
                        }
                    } else {
                        callback(false);
                    }
                } else {
                    callback(false);
                }
            }
        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
        xhr.send(param);//reqData为字符串形式： "key=value"
    };


    /** 有参数POST接口封装
     * @param url 请求地址
     * @param data 请求参数(会签名)
     * @param callback 回调函数
     */
    haveParametersPost(url, param, callback) {
        //2.发起请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    if (response) {
                        var responseJson = JSON.parse(response);
                        if (responseJson.code == 1) {
                            callback(responseJson, responseJson.msg);
                        } else {
                            callback(false, responseJson.msg);
                        }
                    } else {
                        callback(false);
                    }
                } else {
                    callback(false);
                }
            }
        };
        xhr.open("POST", url, true);

        // let isNeedToken = GameDataTable.getDataType(GameData_Type.appToken);
        let isNeedToken = PlayerMessage.playToken;
        // console.log(isNeedToken)
        if (isNeedToken != "") {
            xhr.setRequestHeader('token', isNeedToken);
        }
        xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
        xhr.send(param);//reqData为字符串形式： "key=value"
    };


    /** 接口
     * @param url 请求地址
     * @param data 请求参数(会签名)
     * @param callback 回调函数
     */
    emptyTokeGet(url, callback) {
        //2.发起请求
        var thiss = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    if (response) {
                        // thiss.wxGetUserInfo()
                        var responseJson = JSON.parse(response);
                        callback(responseJson);
                    } else {
                        ////console.log("返回数据不存在")
                        callback(false);
                    }
                } else {
                    ////console.log("请求失败")
                    callback(false);
                }
            }
        }

        xhr.open("GET", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();//reqData为字符串形式： "key=value"
    }

    /** 接口
     * @param url 请求地址
     * @param data 请求参数(会签名)
     * @param callback 回调函数
     */
    haveTokeGet(url, callback) {
        //2.发起请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    if (response) {
                        var responseJson = JSON.parse(response);
                        // ////console.log(responseJson);
                        if (responseJson.code == 1) {
                            callback(responseJson, responseJson.msg);
                        } else if (responseJson.msgCode == 1) {
                            callback(false, responseJson.msg);
                        }
                    } else {
                        ////console.log("返回数据不存在")
                        callback(false);
                    }
                } else {
                    ////console.log("请求失败")
                    callback(false);
                }
            }
        };

        xhr.open("GET", url, true);
        // let isNeedToken = GameDataTable.getDataType(GameData_Type.appToken);
        let isNeedToken = PlayerMessage.playToken;
        if (isNeedToken != "") {
            xhr.setRequestHeader('token', isNeedToken);
            // xhr.setRequestHeader('token', isNeedToken);
        }
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();//reqData为字符串形式： "key=value"
    };

    /**获取code */
    getVXCode() {
        var that = this;
        wx.login({
            success(res) {
                if (res.code) {
                    // 发起网络请求
                    console.log("登录");
                    let str = res.code + "";
                    PlayerMessage.playerCode = str
                    console.log("登录" + PlayerMessage.playerCode);
                    // that.setLoginMessage(str,(res)=>{
                    //     if(res){
                    //         ////console.log("登陆成功");
                    //         UIManager.openUI("UI_Main");
                    //     }
                    // })
                }
                else {
                    ////console.log('登录失败！' + res.errMsg);
                }
            }
        })
    };



    wxGetUserInfo(): Promise<UserInfo> {
        let that = this;
        return new Promise<UserInfo>((r, j) => {
            // let sysInfo = this.getSystemInfo();
            let width = 1624;
            let height = 750;
            wx.getSetting({
                success(res) {
                    console.log(res);
                    if (res.authSetting["scope.userInfo"]) {
                        wx.getUserInfo({
                            // @ts-ignore
                            success: (res) => {
                                console.log(res);
                                console.log("已授权");
                                r(res.userInfo)
                                let avatar = res.userInfo.avatarUrl;
                                let niname = res.userInfo.nickName;
                                let gen = res.userInfo.gender;
                                let lang = res.userInfo.language;
                                let city = res.userInfo.city;
                                let pro = res.userInfo.province;
                                let coun = res.userInfo.country;

                                GameDataTable.setDataType(GameData_Type.playerName, niname);
                                GameDataTable.setDataType(GameData_Type.playerAddress, avatar);
                                let code = PlayerMessage.playerCode;
                                that.setvxLoginMessage(code, niname, avatar,gen,lang,city,pro,coun, (bool, res, msg) => {
                                    if (bool) {

                                    }
                                })
                            },
                            fail: j
                        });
                    } else {
                        console.log("用户未授权");
                        let button = wx.createUserInfoButton({
                            type: 'text',
                            text: '',
                            // @ts-ignore
                            style: {
                                left: 0,
                                top: 0,
                                width: width,
                                height: height,
                                backgroundColor: '#00000000',//最后两位为透明度
                                // color: '#ffffff',
                                // fontSize: 20,
                                // textAlign: "center",
                                // lineHeight: height,
                            }
                        });
                        button.onTap((res) => {
                            button.destroy();
                            console.log("用户授权:", res);
                            if (res.userInfo) {
                                let avatar = res.userInfo.avatarUrl;
                                let niname = res.userInfo.nickName;
                                let gen = res.userInfo.gender;
                                let lang = res.userInfo.language;
                                let city = res.userInfo.city;
                                let pro = res.userInfo.province;
                                let coun = res.userInfo.country;

                                GameDataTable.setDataType(GameData_Type.playerName, niname);
                                GameDataTable.setDataType(GameData_Type.playerAddress, avatar);
                                let code = PlayerMessage.playerCode;
                                that.setvxLoginMessage(code, niname, avatar,gen,lang,city,pro,coun, (bool, res, msg) => {
                                    if (bool) {

                                    }
                                })
                                //此时可进行登录操作
                                r(res.userInfo);
                            } else {
                                console.log("用户拒绝授权:", res);
                                j(res);
                            }
                        });
                    }
                }
            })
        });
    }


    /**VX登陆 */
    setvxLoginMessage(code:any, name:any, avatar:any, gender:any, language:any,city:any,province:any,country:any,callback) {
        let rbUrl = ApiUrl.appUrl + "api/user/authLogin";
        let para = {
            code: code,//code
            nickname: name,//名字
            avatar: avatar,//头像地址
            gender: gender,//性别
            language: language,//语言
            city: city,//城市
            province: province,//省份
            country: country,//国家标识
        }
        let param = JSON.stringify(para);
        this.noTokenParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res)
                // console.log("===================================")
                let atoken = res.data.userinfo.token;
                PlayerMessage.PlayerHeadAdress = res.data.userinfo.avatar;
                PlayerMessage.playToken = atoken;
                // Observer.emit("wxlog")
                // GameDataTable.setDataType(GameData_Type.appToken, atoken);
                //个人信息
                NetWork.getPlayMessage((bool, res, msg) => {
                    if (bool) {
                        ManagerUI.openUI("Home_UI");
                    }
                })
                callback(true, res.msg);
            } else {
                callback(false, res, msg);
            }
        })
    };

    /**获取个人信息 */
    getPlayMessage(callback) {
        let rbUrl = ApiUrl.appUrl + "/api/user/index";
        let para = {
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res);
                //console.log("获取成功");
                // PlayerMessage.PlayerName = res.data.userinfo.nickname;
                // PlayerMessage.PlayerAdress = res.data.userinfo.area;
                callback(true, res, msg);
            } else {
                // ////console.log("系统错误");
                callback(false, res, msg);
            }
        })
    };

    /**获取商城详情 */
    getShopMesssage(callback) {
        let rbUrl = ApiUrl.appUrl + "/api/barrier/shop";
        let para = {
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res);
                let fxLen = res.data.length;
                shopListArr.length = 0
                for (let a = 0; a < fxLen; a++) {
                    shopListArr.push(res.data[a])
                }
                callback(true, res, msg);
            } else {
                // console.log(res);
                callback(false, res, msg);
            }
        })
    };

    /**发送兑换信息 */
    setExchangeMesssage(id: any, callback) {
        let rbUrl = ApiUrl.appUrl + "/api/barrier/exchange";
        let para = {
            id: id,
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res);
                callback(true, res, msg);
            } else {
                ////console.log(res);
                callback(false, res, msg);
            }
        })
    };

    /**获取皮肤 */
    getPiFuMesssage(callback) {
        let rbUrl = ApiUrl.appUrl + "/api/barrier/skin";
        let para = {
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res);
                callback(true, res, msg);
            } else {
                ////console.log(res);
                callback(false, res, msg);
            }
        })
    };

    /**使用皮肤 */
    getYingYongMesssage(id: any, callback) {
        let rbUrl = ApiUrl.appUrl + "/api/barrier/set_default_skin";
        let para = {
            id: id,
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res);
                callback(true, res, msg);
            } else {
                ////console.log(res);
                callback(false, res, msg);
            }
        })
    };

    /**获取游戏开始 */
    getYouXiStartMesssage(callback) {
        let rbUrl = ApiUrl.appUrl + "/api/barrier/start";
        let para = {
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res);
                callback(true, res, msg);
            } else {
                ////console.log(res);
                callback(false, res, msg);
            }
        })
    };


    /**获取每个等级配置 */
    getZiDanMesssage(callback) {
        let rbUrl = ApiUrl.appUrl + "/api/index/bulletLevel";
        let para = {
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res);
                // console.log("----------------------------------------------------");
                callback(true, res, msg);
            } else {
                ////console.log(res);
                callback(false, res, msg);
            }
        })
    };

    /**发送子弹升级消息 */
    setZDSJMesssage(type: any, id: any, callback) {
        let rbUrl = ApiUrl.appUrl + "/api/barrier/upgrade";
        let para = {
            type: type,
            id: id,
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res);
                callback(true, res, msg);
            } else {
                ////console.log(res);
                callback(false, res, msg);
            }
        })
    };

    /**发送闯关成功消息 */
    setWinMesssage(id: any, day: any, callback) {
        let rbUrl = ApiUrl.appUrl + "/api/barrier/finish";
        let para = {
            id: id,
            day: day,
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res);
                callback(true, res, msg);
            } else {
                ////console.log(res);
                callback(false, res, msg);
            }
        })
    };

    /** */
    getPlayerMesssage(callback) {
        let rbUrl = ApiUrl.appUrl + "/api/barrier/upgrade";
        let para = {
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res);
                callback(true, res, msg);
            } else {
                ////console.log(res);
                callback(false, res, msg);
            }
        })
    };

    /**排行榜 */
    getRankMesssage(callback) {
        let rbUrl = ApiUrl.appUrl + "/api/user/rank";
        let para = {
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res);
                callback(true, res, msg);
            } else {
                ////console.log(res);
                callback(false, res, msg);
            }
        })
    };

    /**查看获得的积分 */
    getAddScoreMesssage(callback) {
        let rbUrl = ApiUrl.appUrl + "/api/user/addscore";
        let para = {
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res);
                callback(true, res, msg);
            } else {
                ////console.log(res);
                callback(false, res, msg);
            }
        })
    };

    /**发送杀怪消息 */
    setEnemyScoreMesssage(gameid: any, enemyid: any, callback) {
        let rbUrl = ApiUrl.appUrl + "/api/barrier/score";
        let para = {
            id: gameid,
            monster_id: enemyid,
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl, param, (res, msg) => {
            if (res) {
                // console.log(res);
                callback(true, res, msg);
            } else {
                ////console.log(res);
                callback(false, res, msg);
            }
        })
    };



    




};

