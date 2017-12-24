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
    },
    loginTimer: null,
    userTimer:null,
    timeout: 0,
    onLaunch: function() {
        // 获取用户信息
        wx.getUserInfo({
            success: res => {
                console.log(res.userInfo)
                this.globalData.userInfo = res.userInfo;
                if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                }
            }
        })
        
        // wx.clearStorageSync();
        // wx.removeStorageSync('mydata');
        // this.toLogin();
        //缓存
        try {
            let mydata = wx.getStorageSync('mydata');

            if (mydata) {
                const nowTime = new Date().getTime();
                if (nowTime - mydata.time < 6 * 60 * 60 * 1000) { //缓存6小时
                    this.globalData.token = mydata.token;
                    this.globalData.userInfo = mydata.userInfo;
                    this.globalData.openid = mydata.openid;
                    this.globalData.memberId = mydata.memberId;

                } else {
                    wx.clearStorageSync()
                    this.toLogin();
                }
            } else {
                this.toLogin();
            }
        } catch (e) {

        }
    },
    toLogin: function(fn) {
        let that = this;
        wx.login({
            success: function(loginres) {
                console.log('获取code')
                if (loginres.code) {
                    that.globalData.code = loginres.code;
                    that.getOpenId(loginres.code,fn);
                }
            }
        })
    },
    getOpenId: function(code, fn) {
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
                    console.log('获取openid')
                    let openid = res.data.data.openid;
                    that.globalData.openid = openid;
                    if (JSON.stringify(that.globalData.userInfo) === '{}') {
                        that.userTimer = setInterval(function(){
                            if (JSON.stringify(that.globalData.userInfo) !== '{}') {
                                clearInterval(that.userTimer);
                                that.getMemberLogin(openid, fn);
                            }
                        },200);
                    }else{
                        that.getMemberLogin(openid, fn);
                    }
                    
                    
                }
            }

        })
    },
    getMemberLogin: function(openid, fn) {
        let that = this;
        wx.request({
            method: 'POST',
            url: that.globalData.serverPath + 'api/common/member',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                key: openid,
                name: that.globalData.userInfo.nickName || '',
                mobile: '',
                imgUrl: that.globalData.userInfo.avatarUrl || '',
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
                    fn && fn();
                    console.log('获取token')
                    console.log(that.globalData)
                }

            }
        })
    },
    tokenCheck: function(fn) {
        let that = this;
        if (that.globalData.token) {
            fn && fn();
            return false;
        }
        that.loading('open', '登录中...');
        that.loginTimer = setInterval(function() {
            that.timeout += 200;
            if (that.globalData.token) {
                console.log('已登录')
                clearInterval(that.loginTimer);
                that.loading('close')
                typeof fn == 'function' && fn();
                that.timeout = 0;
            }
            //登录超时
            if (that.timeout >= 60000) {
                console.log('登录超时,重新登录');
                clearInterval(that.loginTimer);
                clearInterval(that.userTimer);
                that.timeout = 0;
                this.toLogin(fn);
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
                let userId;
                if(res.path){
                    userId = res.path.split('=')[1];
                }
                if(res.result){
                    userId = res.result;
                }
                console.log(userId);
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