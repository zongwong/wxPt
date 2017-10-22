// pages/purchase/my/my.js
import util from "../../../utils/util.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activitylist: [],
    flag: 1,
    allCount: 3,
    donePurchase: {
      "id": 5,
      "name":"金钱豹子汽车摆件时钟",
      "desc": "3人拼一元免费洗车10次",
      "status": "已结束",
      "pCode": "899773975584",
      "imgurl": "http://bryanly.oss-cn-shenzhen.aliyuncs.com/baozi.png"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchData(this.data.allCount);
  },
  changeTab: function (event) {
    var dataset = event.currentTarget.dataset;
    var tab = +dataset['tab'];
    var count = +dataset['count'];
    this.setData({
      flag: tab
    });
    this.fetchData(count);
  },
  fetchData: function (len) {
    var newlist = [];
    for (var i = 0; i < len; i++) {
      newlist.push({
        "id": i + 1,
        "name": "金钱豹子汽车摆件时钟",
        "desc": "只需9元，拼单3人购买价值69元金钱豹子汽车摆件",
        "status": util.getRandomArrayElement(["进行中", "报名中", "已结束"]),
        "count": Math.floor(Math.random() * 10),
        "char_gt": ">",
        "imgurl": "http://bryanly.oss-cn-shenzhen.aliyuncs.com/baozi.png"
      })
    }
    this.setData({
      activitylist: newlist
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