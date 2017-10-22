// pages/crowdfunding/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"价值39元积客活动",
    activeImg:'http://bryanly.oss-cn-shenzhen.aliyuncs.com/itembg.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  goToCenter:function(event){
    wx.navigateTo({
      url: '../center/center',
    })
  },

  searchOrder: function (event) {
    wx.redirectTo({
      url: '../buy/buy?name=金钱豹子汽车摆件时钟',
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})