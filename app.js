import utils from "./utils/util.js";
App({
    globalData: {
        userInfo: '',
        token: '',
        code: '',
        openid: '',
        appid: 'wx15d6ca4ad6e41cd8',
        secret: '84f45a7e8b406edf3f802d8bbdbd7aa6',
        serverPath: 'https://www.baby25.cn/jeesite/',
    },
    loginTimer: null,
    onLaunch: function() {
        // wx.clearStorageSync()
        wx.removeStorageSync('mydata');
        this.toLogin();
        // try {
        //     let mydata = wx.getStorageSync('mydata');

        //     if (mydata) {
        //         const nowTime = new Date().getTime();
        //         if (nowTime - mydata.time < 6 * 60 * 60 * 1000) { //缓存6小时
        //             this.globalData.token = mydata.token;
        //             this.globalData.userInfo = mydata.userInfo;
        //             this.globalData.openid = mydata.openid;
        //             this.globalData.memberId = mydata.memberId;

        //         } else {
        //             wx.clearStorageSync()
        //             this.toLogin();
        //         }
        //     } else {
        //         this.toLogin();
        //     }
        // } catch (e) {

        // }
    },
    toLogin: function() {
        let that = this;
        wx.login({
            success: function(loginres) {
                console.log('1获取code')
                if (loginres.code) {
                    that.globalData.code = loginres.code;
                    wx.getUserInfo({
                        success: function(userres) {
                            console.log('2获取userinfo')
                            that.globalData.userInfo = userres.userInfo;
                            that.getOpenId(loginres.code, userres.userInfo);
                        }
                    })
                }
            }
        })

    },
    getOpenId: function(code, userInfo) {
        var that = this;
        wx.request({
            method: 'POST',
            url: that.globalData.serverPath + 'api/common/member/getOpenId',
            data: {
                code: code
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                if (res.data.status == 0) {
                    console.log('3获取openid')
                    that.globalData.openid = res.data.data.openid;
                    that.getMemberLogin(res.data.data.openid, userInfo);
                }
            }

        })
    },
    getMemberLogin: function(openid, userInfo) {
        let that = this;
        wx.request({
            method: 'POST',
            url: that.globalData.serverPath + 'api/common/member',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                key: openid,
                name: userInfo.nickName,
                mobile: '',
                imgUrl: userInfo.avatarUrl,
            },
            success: function(res) {
                if (res.data.code == 0) {
                    let data = res.data.data;
                    that.globalData.token = data.memberId + '_' + data.token;
                    that.globalData.memberId = data.memberId;

                    let mydata = {
                        token: that.globalData.token,
                        userInfo: that.globalData.userInfo,
                        openid: that.globalData.openid,
                        memberId: that.globalData.memberId,
                        time: new Date().getTime(),
                    }
                    wx.setStorageSync('mydata', mydata);
                    console.log('4获取token')
                    console.log(that.globalData)
                }

            }
        })
    },
    tokenCheck: function(fn) {
        let that = this;
        that.loading('open', '检测token')
        that.loginTimer = setInterval(function() {
            if (that.globalData.token) {
                console.log('token有了')
                clearInterval(that.loginTimer);
                that.loading('close')
                typeof fn == 'function' && fn();
            }
        }, 200);
    },
    loading: function(type, text = "加载中") {
        if (type === 'open') {
            wx.showLoading({
                title: text
            })
        } else if (type === 'close') {
            wx.hideLoading()
        }
    },
    scanFunc: function(that, fn) {
        wx.scanCode({
            success: (res) => {
                let userId = res.result;
                if (typeof userId !== 'undefined' && userId) {
                    that.setData({
                        userId: userId,
                        pageNo: 0,
                        scrollEnd: false,
                    });
                    fn();
                    wx.setStorageSync('userId', userId);
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '参数错误,请重新扫码'
                    })
                }
            }
        })
    }

})