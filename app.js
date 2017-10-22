//app.js
App({
    globalData: {
        userInfo: null,
        openid: '',
        appid: 'wx15d6ca4ad6e41cd8',
        secret: '84f45a7e8b406edf3f802d8bbdbd7aa6',
        serverPath: 'https://www.baby25.cn/jeesite/',
        token:'',
    },
    onLaunch: function() {
        this.toLogin();
    },
    toLogin:function(fn){
      var that = this;

      // if(this.globalData.token){
      //     typeof fn == "function" && fn(this.globalData.userInfo);
      // }else{

      // }

      wx.login({
          success: function(res) {
              if (res.code) {
                  console.log('获取登录code:'+res.code);
                  that.getOpenId(res.code);
              } else {
                  console.log('获取用户登录态失败！' + res.errMsg)
              }
          }
      });
      // 获取用户信息
      wx.getSetting({
          success: res => {
              if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                      success: res => {
                          that.globalData.userInfo = res.userInfo;
                          console.log('用户信息:',res.userInfo);
                          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                          // 所以此处加入 callback 以防止这种情况
                          // if (this.userInfoReadyCallback) {
                          //     this.userInfoReadyCallback(res)
                          // }
                      }
                  })
              }
          }
      })
    },
    getOpenId: function(code) {
        var that = this;
        var url = that.globalData.serverPath + 'api/common/member/getOpenId';
        wx.request({
            url: url,
            data: {
                code: code
            },
            method: 'POST',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
                var data = res.data.data;
                var openid = data.openid;
                console.log('openid:'+res.data);
                that.globalData.openid = openid;
                wx.setStorageSync('openid', openid);
                that.getMemberLogin(openid);
            }
        });
    },
    getMemberLogin: function(openid) {
        var that = this;
        var url = that.globalData.serverPath + 'api/common/member';
        var memberInfo = {};
        // wx.getUserInfo({
        //     success: res => {
        //         // 可以将 res 发送给后台解码出 unionId
        //         var userInfo = res.userInfo
                
        //     }
        // })
        wx.request({
            url: url,
            data: {
                key: openid,
                name: that.globalData.userInfo.nickName,
                mobile: '',
                imgUrl: that.globalData.userInfo.avatarUrl,
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            }, // 设置请求的 header    
            success: function(res) {
                // console.log(res);
                var data = res.data;
                if (data.code == '0') {
                    data = data.data;
                    memberInfo.memberId = data.memberId;
                    memberInfo.userId = data.memberId;
                    memberInfo.token = data.token;
                } else {
                    memberInfo.memberId = '';
                    memberInfo.userId = '';
                    memberInfo.token = '';
                }
                wx.setStorageSync('memberInfo', memberInfo);
            }
        });
    }
})