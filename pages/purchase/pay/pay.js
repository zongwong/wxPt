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
                    url: '/pages/purchase/paycomplete/paycomplate?type=success'
                })
            },
            fail: function(res) {
                console.log(res)
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
    onLoad: function(options) {
        let that = this;
        app.tokenCheck(function() {
            that.setData({
                actid: options.actid,
                total: options.price,
                goods: {
                    name: options.name,
                    price: options.price
                }
            })
        })
    },
    pay: function() {
        let that = this;
        console.log(app.globalData.memberId, app.globalData.openid)
        // const memberInfo = wx.getStorageSync('memberInfo');
        // wx.request({
        //     method: 'POST',
        //     url: 'https://www.baby25.cn/jeesite/api/pt/ptGroupOrder/pay',
        //     data: {
        //         type: that.data.check,
        //         num: that.data.counts,
        //         actId: that.data.actid,
        //         userId: app.globalData.memberId,
        //         openid: app.globalData.openid,
        //     },
        //     header: {
        //         'authorization': memberInfo.token
        //     },
        //     success: function(res) {
        //        console.log('统一下单')
        //         console.log(res)
        //         console.log(res.data.data)
        //         if (res.data.code == 0) {
        //             let data = res.data.data;
        //             that.wxPayment(data)
        //         }
        //     },
        //     fail: function(res) {
        //         console.log(res);
        //     }
        // })

        utils.ajax('post', 'api/pt/ptGroupOrder/pay', {
            type: this.data.check,
            num: this.data.counts,
            actId: this.data.actid,
            userId: app.globalData.memberId,
            openid: app.globalData.openid,
        }, function(res) {
            console.log('统一下单')
            console.log(res)
            console.log(res.data.data)
            if (res.data.code == 0) {
                let data = res.data.data;
                that.wxPayment(data)
            }
        })
    },
})