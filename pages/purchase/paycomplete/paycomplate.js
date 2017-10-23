Page({
    data: {
        successImg: '../../../images/pintuan/paysuccess.png',
        failImg: '../../../images/pintuan/payfail.png',
        type:'',
    },
    onLoad: function(options) {
        this.setData({
            type: options.type
        })
        console.log(options.type,this.data.type)
    },
    invitePurchase: function(event) {
        wx.redirectTo({
            url: '../my/my',
        });
    },
    rePt:function(){
        wx.switchTab({
            url: '/pages/purchase/purchase',
        });
    },
    showShare: function() {
        console.log(1)
        wx.showShareMenu({
            withShareTicket: true
        })
    },
    onShareAppMessage: function() {

    }
})