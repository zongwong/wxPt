const utils = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        actId: '',
        inviteId: '',
        userId: '',
        counts: 1,
        goods: { price: '', name: '' },
        total: '',
        check: '1',
        checkImg: '../../../images/pintuan/arrow.png',
        uncheckedImg: '../../../images/pintuan/blank.png',
        wechatIcon: '../../../images/pintuan/wechat.png',
        huiyuanIcon: '../../../images/pintuan/huiyuan.png',
        wxPayment: {},
        number:'',
    },

    onLoad: function(options) {
        let that = this;
        console.log(options)
        app.tokenCheck(function() {

            if (typeof options.userId !== 'undefined' && options.userId) {
                that.setData({
                    userId: options.userId
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '参数错误,请重新进入',
                    success: function() {
                        wx.switchTab({
                            url: '/pages/purchase/purchase'
                        })
                    }
                })
                return false;
            }

            that.setData({
                actId: options.actId,
                total: options.price,
                number:options.number,
                goods: {
                    name: options.name,
                    price: options.price
                }
            })

            if (typeof options.inviteId !== 'undefined' && options.inviteId) {
                that.setData({
                    inviteId: options.inviteId
                })
            }

        })
    },
    changeCount: function(event) {
        var dataset = event.currentTarget.dataset;
        var optiontype = dataset['type'];
        var currentCount = this.data.counts;
        if (optiontype == 'minus' && currentCount >= 2) {
            currentCount--;
        } else if (optiontype == 'plus') {
            currentCount++;
        } else {
            currentCount = 1;
        }
        this.setData({
            counts: currentCount,
            total: (this.data.goods.price * currentCount).toFixed(2)
        })
    },
    checkPay: function(event) {
        var dataset = event.currentTarget.dataset;
        var paytype = dataset['type'];
        this.setData({
            check: paytype
        })
    },
    pay: function() {
        let that = this;
        let cs = {
            type: that.data.check,
            num: that.data.counts,
            actId: that.data.actId,
            userId: that.data.userId,
            openid: app.globalData.openid,
            inviteId: that.data.inviteId,
        };
        console.log(cs)
        utils.ajax('post', 'api/pt/ptGroupOrder/pay', cs, function(res) {
            console.log('统一下单')
            console.log(res.data)
            if (res.data.code == 0) {
                let data = res.data.data;
                that.wxPayment(data)
            }
        })
    },
    wxPayment: function(wxPayment) {
        console.log('调用微信支付')
        let that = this;
        let data = {
            timeStamp: wxPayment.timeStamp.toString(),
            nonceStr: wxPayment.nonceStr,
            package: wxPayment.wxPackage,
            signType: 'MD5',
            paySign: wxPayment.sign,
            success: function(res) {
                wx.navigateTo({
                    url: '/pages/purchase/paycomplete/paycomplate?type=success&number='+that.data.number+'&actId='+that.data.actId+'&userId='+that.data.userId+'&inviteId='+that.data.inviteId
                })
            },
            fail: function(res) {
                wx.navigateTo({
                    url: '/pages/purchase/paycomplete/paycomplate?type=fail'
                })
            },
            complete: function(res) {
                console.log(res)
            },
        }
        console.log(data);
        wx.requestPayment(data);
    },
})