// pages/purchaseDetail/purchaseDetail.js
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    indicatorActivColor: '#E12F25',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    house: '../../../images/funding/house.png',
    addr: '../../../images/funding/addr.png',
    triangleImg: '../../../images/funding/ddd.png',
    menbers: [
      {
        "face": "../../../images/funding/face-default.png",
        "name": "中途小妹",
        "time": "2017/09/23"
      },
      {
        "face": "../../../images/funding/face-default.png",
        "name": "中途小di",
        "time": "2017/09/23"
      }
    ]
  },
  calling: function (event) {
    var dataset = event.currentTarget.dataset;
    var telNum = dataset['tel'];
    util.phoneCallFn(telNum);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '众筹-' + options.name,
    })
  },

  partake: function (event) {
    wx.navigateTo({
      url: '../buy/buy?id=1111&name=金钱豹子汽车摆件时钟',
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