// pages/user/award/award.js
const app = getApp();
Page({
    data: {
        options:{},
    },
    lookMine: function(event) {
        wx.redirectTo({
            url: '../mine/mine',
        })
    },
    onLoad: function(options) {
      this.setData({
        options:JSON.parse(options.query)
      })
    },
    onShareAppMessage: function(res) {
        let myname = app.globalData.userInfo.nickName;
        let query = 'id='+this.data.options.id+'&userId='+this.data.options.userId+'&originId='+this.data.options.originId+'&orderId='+this.data.options.orderId+'&originName='+myname;

        return {
            title: myname +'邀请您代抽奖品',
            path: '/pages/user/detail/detail?'+query,
            imageUrl:this.data.options.shareImg,
            success: function(res) {
                console.log('分享成功:'+query)
            },
            fail: function(res) {
                // 转发失败
            }
        }
    }
})