// pages/user/award/award.js
Page({
  data: {
    userName:"世界在脚下",
    goodInfo: {
      id: "1",
      goodImg: "http://bryanly.oss-cn-shenzhen.aliyuncs.com/benz.png",
      goodTitle: "￥4980元铠甲镀晶"
    },
    giftName:"￥10元m免费洗车一次"
  },
  lookMine: function (event) {
    wx.redirectTo({
      url: '../mine/mine',
    })
  },
  onLoad: function (options) {
    this.setData({
      options:options.query
    })
  },
  onShareAppMessage: function (res) {
    
  }
})