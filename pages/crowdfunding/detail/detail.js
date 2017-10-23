const utils = require('../../../utils/util.js');
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
    friendPay:false,
    menbers: [
      {
        "imgUrl": "../../../images/funding/face-default.png",
        "name": "中途小妹",
        "time": "2017/09/23"
      },
      {
        "imgUrl": "../../../images/funding/face-default.png",
        "name": "中途小di",
        "time": "2017/09/23"
      }
    ]
  },
  calling: function (event) {
    var dataset = event.currentTarget.dataset;
    var telNum = dataset['tel'];
    utils.phoneCallFn(telNum);
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '众筹-'+options.name,
    });
    if (typeof options.friendPay !== 'undefined' && options.friendPay) {
      this.setData({
        friendPay:options.friendPay
      })
    }
    const that = this;
    utils.ajax('get','api/zc/zcActivity/info',{
      actId:options.id
    },function(res){

      if (typeof res.data.data === 'undefined') {
        console.log('没有众筹数据了');
        return false;
      }

      let activityInfo = res.data.data;
      that.setData({
        activityInfo: activityInfo,
        endTime: activityInfo.endTime,
      })

      if (typeof activityInfo.memberList !== 'undefined') {
        that.setData({
          menbers: activityInfo.memberList,
        })
      }

      setInterval(function () {
        that.setData({
          timeCountDown: timeUtil.countDown(that.data.endTime)
        })
      }, 1000);

    })
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },
  onShareAppMessage: function () {
    return {
      title: app.globalData.userInfo.nickName+'正在参与"'+this.data.activityInfo.zcGoods.name+'"众筹项目，邀请您为他支持！',
      path: '/pages/crowdfunding?type=true&userId=',
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },
  payImmediately:function(event){
    let that = this;
    utils.ajax('POST','api/zc/zcOrder/pay',{
      orderId:1,
      type:1,
      isHelp:1,
      userId:app.globalData.memberId,
      openid:app.globalData.openid,
    },function(res){
      if (res.data.code == 0) {
        let data = res.data.data;
        that.wxPayment(data)
      }
    })
  }

})