// pages/crowdfunding/pay/pay.js
Page({
  data: {
    title:"价值39元积客活动",
    activeImg:'https://bryanly.oss-cn-shenzhen.aliyuncs.com/itembg.png',
    options:null,
    isMyself:false,
  },
  onLoad: function (options) {
    this.setData({
      options:options.query
    })
    if (this.data.options.originId == app.globalData.memberId ) {
      this.setData({
        isMyself:true,
      })
    }
  },
  goToCenter:function(event){
    wx.navigateTo({
      url: '../center/center',
    })
  },
  // 查看订单
  searchOrder: function (event) {
    let query = 'id=' + this.data.options.id + '&userId=' + this.data.options.userId + '&inviteId=' + this.data.options.inviteId + '&originId=' + this.data.options.originId;
    wx.redirectTo({
      url: '/pages/crowdfunding/detail/detail?' + query
    })
  }
})