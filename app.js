import utils from "./utils/util.js";
App({
    globalData: {
        userInfo: {},
        token: '',
        code: '',
        openid: '',
        appid: 'wx15d6ca4ad6e41cd8',
        secret: '84f45a7e8b406edf3f802d8bbdbd7aa6',
        serverPath: 'https://www.baby25.cn/jeesite/',
        islogin:false,
    },
    onLaunch: function() {
         this.toLogin();
         this.userInfoReadyCallback = res => {
            console.log('获取用户名成功回调')
         }
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
                        if (loginres.code) {
                            that.globalData.code = loginres.code;
                            if (!that.globalData.userInfo) {
                                wx.getUserInfo({
                                    success: function(userres) {
                                        that.globalData.userInfo = userres.userInfo;
                                        if (!that.globalData.openid) {
                                            that.getOpenId(loginres.code, userres.userInfo, fn);
                                        }
                                        
                                    }
                                })
                            }else{
                                if (!that.globalData.openid) {
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
                // console.log(that.globalData.openid,res.data.openid)
                that.getMemberLogin(res.data.data.openid, userInfo,fn);
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
                    fn && fn();
                }

            }
        })
    }

})