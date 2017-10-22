Page({
  /**
   * 页面的初始数据
   */
  data: {
    sortindex: 0,  //排序索引
    sortid: null,  //排序id
    sort: [],
    myitems: [], //会议室列表列表
    scrolltop: null, //滚动位置
    page: 0,  //分页
    // activeTab: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDataDistType();
  },

  // changeTab: function (event) {
  //   var dataset = event.currentTarget.dataset;
  //   var type = dataset['type'];
  //   var flag = true;
  //   if (type == 'award' && this.data.activeTab) {
  //     flag = flag;
  //     this.loadDataDistType();
  //   } else if (type == 'draw') {
  //     flag = !flag;
  //     this.loadDataDistType();
  //   }
  //   this.setData({
  //     activeTab: flag
  //   });
  // },
  loadDataDistType: function () {
    var fromServer = [];
    for (var i = 0; i < 3; i++) {
      var data = {
        id: Math.floor(Math.random() * 10000) + '',
        code: Math.floor(Math.random() * 100000000000) + '',
        date: '2017-10-11',
        name: '铠甲镀晶',
        qrcodeImg: '../../../images/user/qrcode.png',
        myImg: 'http://bryanly.oss-cn-shenzhen.aliyuncs.com/itembg.png',
        count: Math.floor(Math.random() * 10) + '',
        price: Math.floor(Math.random() * 1000)
      }
      fromServer.push(data);
    }
    this.setData({
      myitems: fromServer
    })
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
      page: 0
    })
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