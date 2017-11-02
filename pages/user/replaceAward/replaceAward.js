// pages/user/award/award.js
Page({
  data: {
    options:{},
  },
  lookMine: function (event) {
    wx.redirectTo({
      url: '../mine/mine',
    })
  },
  onLoad: function (options) {
    this.setData({
      options:JSON.parse(options.query)
    })
  },
  onShareAppMessage: function (res) {
    
  }
})