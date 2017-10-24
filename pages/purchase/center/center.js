const app = getApp()
Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        money: 122
    },
    onLoad: function(options) {
        let that = this;
        app.tokenCheck(function(){
          that.setData({
              userInfo: app.globalData.userInfo
          })
        });
    },
    onShareAppMessage: function() {

    },
})