// pages/user/award/award.js
Page({
  data: {
    options:{},
    friendAward:'',
    myAward:'',
  },
  lookMine: function (event) {
    wx.redirectTo({
      url: '../mine/mine',
    })
  },
  onLoad: function (options) {
    this.setData({
      options:JSON.parse(options.query)
    })
    let friendAward = Boolean(+this.data.options.friendAward);
    let myAward = Boolean(+this.data.options.myAward);
    this.setData({
      friendAward:friendAward,
      myAward: myAward,
    })
    console.log(this.data)
  },
  onShow:function(){
    if (!this.data.friendAward) {
      wx.showModal({
        title:'提示',
        content:'很遗憾,没有为您朋友抽中奖品'
      })
    }

  }
})