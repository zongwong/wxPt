const utils = require('../../../utils/util.js');
Page({
    data: {
        successImg: '../../../images/pintuan/paysuccess.png',
        failImg: '../../../images/pintuan/payfail.png',
        type: '',
        number: '',
        actId: '',
        userId: '',
        inviteId: '',
    },
    onLoad: function(options) {
        this.setData({
            type: options.type,
            number: options.number,
            actId: options.actId,
            userId: options.userId,
            inviteId: options.inviteId,
        })
        this.getInviteId();
    },
    invitePurchase: function(event) {
        wx.redirectTo({
            url: '../my/my',
        });
    },
    rePt: function() {
        wx.switchTab({
            url: '/pages/purchase/purchase',
        });
    },
    getInviteId:function(){
        let that = this;
        if (!this.data.inviteId) {
            utils.ajax('GET','api/pt/ptGroupOrder/list',{
                pageNo: 1,
                pageSize: 1,
                status: 1,
            },function(res){
                if (res.data.code == 0) {
                    that.setData({
                        inviteId: res.data.data[0].inviteId
                    })
                }
            })
        }
    },
    onShareAppMessage: function() {
        let query = '?id=' + this.data.actId + '&inviteId=' + this.data.inviteId + '&userId=' + this.data.userId;
        console.log('拼团分享url:' + query)
        return {
            title: '我正在拼团快来啊~',
            path: '/pages/purchase/immediately/immediately' + query,
            success: function(res) {
                console.log('拼团转发成功')
            },
            fail: function(res) {

            }
        }
    }
})