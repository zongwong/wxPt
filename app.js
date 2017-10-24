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
    onLaunch: function() {
        this.toLogin();
    },
    toLogin: function(fn) {
        let that = this;
        
        if (this.globalData.token) {
            
            typeof fn == "function" && fn();
        } else {
            
            if (this.globalData.openid && this.globalData.userInfo) {
                
                this.getMemberLogin(this.globalData.openid, this.globalData.userInfo, fn);
            } else {
                
                wx.login({
                    success: function(loginres) {
                        console.log(loginres)
                        if (loginres.code) {
                            that.globalData.code = loginres.code;
                            console.log(that.globalData.userInfo, !that.globalData.userInfo)
                            if (!that.globalData.userInfo) {
                                wx.getUserInfo({
                                    success: function(userres) {
                                        console.log('userres:' + userres.userInfo)
                                        that.globalData.userInfo = userres.userInfo;
                                        console.log(that.globalData.userInfo)
                                        if (!that.globalData.openid) {
                                            that.getOpenId(loginres.code, userres.userInfo, fn);
                                        }

                                    }
                                })
                            } else {
                                if (!that.globalData.openid) {
                                    console.log('else:' + that.globalData.userInfo)
                                    that.getOpenId(loginres.code, that.globalData.userInfo, fn);
                                }
                            }
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
                console.log(res.data.data)
                that.globalData.openid = res.data.data.openid;
                that.getMemberLogin(res.data.data.openid, userInfo, fn);
            }
        })


        // utils.ajax('post','api/common/member/getOpenId',{code:code},function(res){
        //     console.log(res);
        //     return false;
        //     const data = res.data.data;
        //     console.log(data)
        //     const openid = data.openid;
        //     that.globalData.openid = openid;
        //     wx.setStorageSync('openid', openid);
        //     that.getMemberLogin(openid);
        // });
    },
    getMemberLogin: function(openid, userInfo, fn) {
        console.log('准备登录');
        if (this.globalData.token) {
            console.log('有token了');
            console.log(this.globalData.token)
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
                    console.log('登录成功');
                    console.log(that.globalData)
                    fn && fn();
                }

            }
        })
    },
    tokenCheck: function(fn) {
        let that = this;
        let loginTimer = setInterval(function() {
            if (that.globalData.token) {
                typeof fn == 'function' && fn();
                clearInterval(loginTimer);
            }
        }, 10);
    }

})