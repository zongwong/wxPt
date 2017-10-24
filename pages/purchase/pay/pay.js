const utils = require('../../../utils/util.js');
const app = getApp();
Page({
    data: {
        actid: '',
        counts: 1,
        goods: { price: '', name: '' },
        total: '',
        check: '1',
        checkImg: '../../../images/pintuan/arrow.png',
        uncheckedImg: '../../../images/pintuan/blank.png',
        wechatIcon: '../../../images/pintuan/wechat.png',
        huiyuanIcon: '../../../images/pintuan/huiyuan.png',
        wxPayment: {},
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
            total: this.data.goods.price * currentCount
        })
    },
    checkPay: function(event) {
        var dataset = event.currentTarget.dataset;
        var paytype = dataset['type'];
        this.setData({
            check: paytype
        })
    },
    wxPayment: function(wxPayment) {
        let that = this;
        let data = {
            timeStamp: wxPayment.timeStamp.toString(),
            nonceStr: wxPayment.nonceStr,
            package: wxPayment.wxPackage,
            signType: 'MD5',
            paySign: wxPayment.sign,
            success: function(res) {
                wx.navigateTo({
                    url: '/pages/purchase/paycomplete/paycomplate?type=success'
                })
            },
            fail: function(res) {
                console.log(res)
                wx.navigateTo({
                    url: '/pages/purchase/paycomplete/paycomplate?type=fail'
                })
            },
            complete: function() {

            },
        }
        console.log(data);
        wx.requestPayment(data);
    },
    onLoad: function(options) {
        this.setData({
            actid: options.actid,
            total: options.price,
            goods: {
                name: options.name,
                price: options.price
            }
        })
    },
    pay: function() {
        let that = this;
        utils.ajax('post', 'api/pt/ptGroupOrder/pay', {
            type: this.data.check,
            num: this.data.counts,
            actId: this.data.actid,
            userId: app.globalData.memberId,
            openid: app.globalData.openid,
        }, function(res) {
            if (res.data.code == 0) {
                let data = res.data.data;
                that.wxPayment(data)
            }
        })
    },
})