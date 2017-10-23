Page({
    data: {
        successImg: '../../../images/pintuan/paysuccess.png',
        failImg: '../../../images/pintuan/payfail.png',
        type: 1
    },
    onLoad: function(options) {
        this.setData({
            type: options.type
        })

    },
    invitePurchase: function(event) {

        wx.redirectTo({
            url: '../my/my',
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