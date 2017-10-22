// pages/purchaseDetail/purchaseDetail.js
const util = require('../../../utils/util.js');
import httpsReq from "../../../utils/httpsReq.js";
import timeUtil from "../../../utils/timeUtil.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeCountDown: '',
    endTime: '',
    activityInfo: null,
    imgUrls: [
      'http://bryanly.oss-cn-shenzhen.aliyuncs.com/baozi.png',
      'http://bryanly.oss-cn-shenzhen.aliyuncs.com/car.png',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: true,
    indicatorActivColor: '#E12F25',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    house: '../../../images/pintuan/house.png',
    addr: '../../../images/pintuan/addr.png',
    triangleImg: '../../../images/pintuan/ddd.png'
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
    var that = this;
    var memberInfo = wx.getStorageSync('memberInfo');
    // 获取活动列表
    var url = app.globalData.serverPath + 'api/pt/ptActivities/info?actId=' + options.id + '&inviteId=';
    var header = {
      'authorization': memberInfo.memberId + '_' + memberInfo.token
    };
    httpsReq._get(url, header, function (res) {
      var data = res.data.data;
      console.log(data)
      if (data) {
        that.setData({
          activityInfo: data,
          endTime: data.endTime
        })
      }
    }, function (res) {
      console.log('error')
      console.log(res)
    });
    setInterval(function () {
      that.setData({
        timeCountDown: timeUtil.countDown(that.data.endTime)
      })
    }, 1000);
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