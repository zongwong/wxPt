// pages/pay/pay.js
Page({
  data: {
    counts: 1,
    price: 50,
    total: 50,
    check: 'wechat',
    checkImg: '../../../images/pintuan/arrow.png',
    uncheckedImg:'../../../images/pintuan/blank.png',
    wechatIcon: '../../../images/pintuan/wechat.png',
    huiyuanIcon: '../../../images/pintuan/huiyuan.png'
  },
  changeCount: function (event) {
    var dataset = event.currentTarget.dataset;
    var optiontype = dataset['type'];
    var currentCount = this.data.counts;
    if (optiontype == 'minus' && currentCount != 0) {
      currentCount--;
    } else {
      currentCount++;
    }
    this.setData({
      counts: currentCount,
      total: this.data.price * currentCount
    })
  },
  checkPay: function (event) {
    var dataset = event.currentTarget.dataset;
    var paytype = dataset['type'];
    this.setData({
      check: paytype
    })
  },
  payComplate: function(event){
    wx.navigateTo({
      url: '../paycomplete/paycomplate',
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})