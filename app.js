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
        islogin: false,
    },
    loginTimer:null,
    onLaunch: function() {
        this.toLogin();
    },
    toLogin: function(fn) {
        let that = this;
        if (this.globalData.token) {
            typeof fn == "function" && fn();
            return false;
        } else {
            if (this.globalData.openid && this.globalData.userInfo) {
                this.getMemberLogin(this.globalData.openid, this.globalData.userInfo, fn);
            } else {
                wx.login({
                    success: function(loginres) {
                        console.log('1获取code')
                        if (loginres.code) {
                            that.globalData.code = loginres.code;
                            wx.getUserInfo({
                                success: function(userres) {
                                    console.log('2获取userinfo')
                                    that.globalData.userInfo = userres.userInfo;
                                    that.getOpenId(loginres.code, userres.userInfo, fn);
                                }
                            })
                        }
                    }
                })
            }
        }
    },
    getOpenId: function(code, userInfo, fn) {
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
                console.log('3获取openid')
                that.globalData.openid = res.data.data.openid;
                that.getMemberLogin(res.data.data.openid, userInfo, fn);
            }
        })
    },
    getMemberLogin: function(openid, userInfo, fn) {
        if (this.globalData.token) {
            typeof fn == "function" && fn();
            return false;
        }
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
                if (res.data.code == '0') {
                    let data = res.data.data
                    that.globalData.token = data.memberId + '_' + data.token;
                    that.globalData.memberId = data.memberId;
                    let memberInfo = {};
                    memberInfo.memberId = data.memberId;
                    memberInfo.userId = data.memberId;
                    memberInfo.token = that.globalData.token;
                    wx.setStorageSync('memberInfo', memberInfo);
                    fn && fn();
                    console.log('4获取token')
                    console.log(that.globalData)
                }

            }
        })
    },
    tokenCheck: function(fn) {
        let that = this;
        that.loginTimer = setInterval(function() {
            console.log('检测..')
            if (that.globalData.token) {
                console.log('清除检测')
                clearInterval(that.loginTimer);
                typeof fn == 'function' && fn();
            }
        }, 50);
    },
    loading:function(type){
        if (type==='open') {
            wx.showLoading({
                title:'加载中'
            })
        }else if (type === 'close') {
            wx.hideLoading()
        }
    }

})