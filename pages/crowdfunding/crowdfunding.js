// pages/purchase/purchase.js
import util from "../../utils/util.js";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sortindex: 0,  //排序索引
    sortid: null,  //排序id
    sort: [],
    activitylist: [], //会议室列表列表
    scrolltop: null, //滚动位置
    page: 0 , //分页
    perpage: 5
  },
  onLoad: function (options) {
    this.fetchPurchaseData();
  },
  fetchPurchaseData: function () {
    let that = this;
    const memberInfo = wx.getStorageSync('memberInfo');
    this.setData({
      page: this.data.page + 1
    })
    let url = app.globalData.serverPath+'/api/zc/zcActivity/list'
      wx.request({
        url: url,
        method:'get',
        data:{
          pageNo:that.data.page,
          pageSize:that.data.perpage,
          status:0,
        },
        header: {
          'authorization': memberInfo.memberId + '_' + memberInfo.token
        },
        success: function (res) {
          if(res.data.code==0){
            let newlist = that.data.activitylist.concat(res.data.data);
            that.setData({
              activitylist: newlist
            })
          }else{

          }
        },
        fail: function (res) {
          
        }
      });

  },
  setSortBy: function (e) { //选择排序方式
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      sortindex: dataset.sortindex,
      sortid: dataset.sortid
    })
    console.log('排序方式id：' + this.data.sortid);
  },
  setStatusClass: function (e) { //设置状态颜色
    console.log(e);
  },
  scrollHandle: function (e) { //滚动事件
    this.setData({
      scrolltop: e.detail.scrollTop
    })
  },
  goToTop: function () { //回到顶部
    this.setData({
      scrolltop: 0
    })
  },
  scrollLoading: function () { //滚动加载
    this.fetchPurchaseData();
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
    this.setData({
      page: 0,
      activitylist: []
    })
    this.fetchPurchaseData();
    this.fetchSortData();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
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