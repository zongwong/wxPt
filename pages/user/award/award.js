// pages/user/award/award.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodInfo: {
      id: "1",
      goodImg: "http://bryanly.oss-cn-shenzhen.aliyuncs.com/benz.png",
      goodTitle: "￥4980元铠甲镀晶",
      time: 3,
      inviteFlag: true
    }
  },
  lookMine: function (event) {
    wx.redirectTo({
      url: '../mine/mine',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  replaceAward: function(event){

  wx.redirectTo({
    url: '../replace/replace?name=世界在你脚下',
  })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '大众维修店',
      path: '/pages/user/replace/replace?share=true',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})