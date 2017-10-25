const app = getApp()
Page({
    data: {
        userInfo: {},
        money: 122
    },
    goToMyFunding: function() {
        wx.redirectTo({
            url: '../mine/mine',
        })
    },
    onLoad: function(options) {
        let that = this;
        app.tokenCheck(function() {
            that.setData({
                userInfo: app.globalData.userInfo,
            })
        })
    },
    onShareAppMessage: function() {

    },
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    }
})