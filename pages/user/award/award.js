// pages/user/award/award.js
const app = getApp();
Page({
    data: {
        goodInfo: {
            id: "1",
            goodImg: "http://bryanly.oss-cn-shenzhen.aliyuncs.com/benz.png",
            goodTitle: "￥4980元铠甲镀晶",
            time: 3,
            inviteFlag: true
        },
        options:{},
    },
    lookMine: function(event) {
        wx.redirectTo({
            url: '../mine/mine',
        })
    },
    onLoad: function(options) {
      this.setData({
        options:options.query
      })
    },
    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '大众维修店',
            path: '/pages/user/replace/replace?share=true',
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }
})