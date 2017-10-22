const util = require('../../../utils/util.js');
import timeUtil from "../../../utils/timeUtil.js";
const app = getApp();
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    activityInfo:null,
    endTime:null,
    timeCountDown:null,
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
      title: '众筹-'+options.name,
    });
    const memberInfo = wx.getStorageSync('memberInfo');
    const url = app.globalData.serverPath+'api/zc/zcActivity/info';
    const that = this;
    wx.request({
      url:url,
      method:'get',
      data:{
        actId:options.id,
      },
       header: {
          'authorization': memberInfo.memberId + '_' + memberInfo.token
        },
      success:function(res){
        console.log(res.data.data)
        const data= res.data.data;
        if (data) {
          that.setData({
            activityInfo: data,
            endTime: data.endTime
          })
        }

        setInterval(function () {
            that.setData({
              timeCountDown: timeUtil.countDown(that.data.endTime)
            })
          }, 1000);
      }
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

  },

  payImmediately:function(event){
    wx.showModal({
      title: '调起支付接口',
      content: '支付完成',
      showCancel: false,//去掉取消按钮
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../pay/pay',
          })
        }
      }
    })
  }

})