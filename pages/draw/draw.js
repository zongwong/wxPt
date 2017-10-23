import util from "../../utils/util.js";
Page({
  data: {
    sortindex: 0,
    sortid: null,
    sort: [],
    activitylist: [],
    scrolltop: null,
    page: 0
  },
  onLoad: function (options) {
    this.fetchPurchaseData();
  },
  fetchPurchaseData: function () {
    const perpage = 10;
    this.setData({
      page: this.data.page + 1
    })
    const page = this.data.page;
    const newlist = [];
    for (var i = (page - 1) * perpage; i < page * perpage; i++) {
      newlist.push({
        "id": i + 1,
        "title": "VIP客户专享*幸运大转盘抽终身保养卡",
        "price": Math.floor(Math.random() * 10) + "元博",
        "imgurl": "http://bryanly.oss-cn-shenzhen.aliyuncs.com/draw.png"
      })
    }
    this.setData({
      activitylist: this.data.activitylist.concat(newlist)
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
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})