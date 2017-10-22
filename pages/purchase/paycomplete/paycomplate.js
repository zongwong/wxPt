// pages/purchase/paycomplete/paycomplate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    successImg: '../../../images/pintuan/paysuccess.png',
    failImg: '../../../images/pintuan/payfail.png',
    flag: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  invitePurchase: function (event) {
    var dataset = event.currentTarget.dataset;
    var type = dataset['type'];
    var url = '../pintuan/pintuan';
    if (type == 'invite') {
      var url = '../pintuan/pintuan';
    } else if (type == 'check') {
      url = '../my/my';
    }
    wx.redirectTo({
      url: url,
    });
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