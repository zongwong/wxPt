const utils = require('../../../utils/util.js');
import timeUtil from "../../../utils/timeUtil.js";
const app = getApp();
Page({
    data: {
        goodsImgs: [],
        activityInfo: null,
        endTime: null,
        timeCountDown: null,
        indicatorDots: true,
        indicatorActivColor: '#E12F25',
        autoplay: true,
        interval: 5000,
        duration: 1000,
        house: '../../../images/funding/house.png',
        addr: '../../../images/funding/addr.png',
        inviteId: '',
        originId: '',
        isMyself: true,
        iInList: false,
        members: [],
        userId: '',
        isEnough: false,
    },
    calling: function(event) {
        var dataset = event.currentTarget.dataset;
        var telNum = dataset['tel'];
        utils.phoneCallFn(telNum);
    },
    onLoad: function(options) {
        let that = this;
        //userid必须
        //originId判断是否自己, 
        //入口,我未下单  我 已下单  inviteId判断
        //好友,已支付 , 未支付  iInList判断
        //先发起 凑够人 支付金额isEnough
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
                            url: '/pages/crowdfunding/crowdfunding'
                        })
                    }
                })
                return false;
            }

            if (typeof options.originId !== 'undefined' && options.originId) {
                that.setData({
                    originId: options.originId,
                })
                //判断众筹单是不是自己发起的
                if (options.originId != app.globalData.memberId) {
                    that.setData({
                        isMyself: false
                    })
                }
            }
            if (typeof options.inviteId !== 'undefined' && options.inviteId) {
                that.setData({
                    inviteId: options.inviteId
                })
            }

            utils.ajax('GET', 'api/zc/zcActivity/info', {
                actId: options.id,
                inviteId: that.data.inviteId,
            }, function(res) {

                if (res.data.code == 0) {
                    let data = res.data.data;
                    that.setData({
                        activityInfo: data,
                        endTime: data.endTime,
                    });
                    if (typeof data.zcOrderDetails != 'undefined' && data.zcOrderDetails) {


                        let helpList = data.zcOrderDetails.filter(function(item) {
                            return item.status == 1 && item.isHelp == 1
                        })


                        if (helpList.length) {
                            helpList.forEach(function(item) {
                                //判断自己是否在列表
                                if (item.headId == app.globalData.memberId) {
                                    that.setData({
                                        iInList: true
                                    })
                                }
                            })
                            that.setData({
                                members: helpList
                            })
                        }
                    }

                    // 商品img处理
                    let goodsImgs = data.zcGoods.imgUrl.split(',')
                    that.setData({
                        goodsImgs:goodsImgs
                    })
                    let endtime = timeUtil.countDown(that.data.endTime);

                    // if (!endtime) {
                    //     wx.showModal({
                    //         title: '提示',
                    //         content: '时间错误',
                    //         success: function(res) {
                    //             wx.switchTab({
                    //                 url: '/pages/crowdfunding/crowdfunding'
                    //             })
                    //         }
                    //     })
                    // } else if (endtime === '活动已结束') {
                    //     wx.showModal({
                    //         title: '提示',
                    //         content: '来晚啦,活动已结束~',
                    //         success: function(res) {
                    //             wx.switchTab({
                    //                 url: '/pages/crowdfunding/crowdfunding'
                    //             })
                    //         }
                    //     })
                    // } else {
                    //     setInterval(function() {
                    //         that.setData({
                    //             timeCountDown: timeUtil.countDown(that.data.endTime)
                    //         })
                    //     }, 1000);
                    // }
                }
            })
        })
    },
    startzc: function(fn) {
        let that = this;
        utils.ajax('POST', 'api/zc/zcOrder/save', {
            actId: that.data.activityInfo.id,
            userId: that.data.userId,
        }, function(res) {

            if (res.data.code == 0) {

                let data = res.data.data;
                if (that.data.isMyself) { //我发起众筹                  
                    that.setData({
                        inviteId: data.id
                    })
                    fn && fn();
                } else {
                    let query = 'id=' + that.data.activityInfo.id + '&inviteId=' + data.orderNumber + '&userId=' + that.data.userId + '&originId=' + app.globalData.memberId;
                    wx.redirectTo({
                        url: '/pages/crowdfunding/detail/detail?' + query
                    })
                }
            }
        })
    },
    // 检测众筹是否发起
    checkOrder: function(e) {
        let type = e.currentTarget.dataset['type']
        if (this.data.inviteId) {
            this.payImmediately();
        } else {
            if (type == 'share') {
                this.startzc(function() {
                    wx.showShareMenu({
                        withShareTicket: true
                    })
                });
            } else {
                this.startzc();
            }

        }
    },
    payImmediately: function(event) {

        //人数判断?
        if (this.data.members.length >= this.data.activityInfo.maxCount) {
            this.setData({
                isEnough: true
            })
        }
        //我要支付
        if (this.data.isMyself && !this.data.isEnough) {
            wx.showModal({
                title: '提示',
                content: '众筹人数不足'
            })
            return false;
        }

        let that = this;
        let isHelp = 0;
        let price = that.data.activityInfo.zcGoods.price - that.data.activityInfo.discountPrice * that.data.activityInfo.maxCount;
        if (!this.data.isMyself) {
            isHelp = 1;
            price = that.data.activityInfo.payPrice;
        }
        utils.ajax('POST', 'api/zc/zcOrder/pay', {
            orderId: that.data.inviteId,
            type: 1,
            isHelp: isHelp,
            openid: app.globalData.openid,
            userId: that.data.userId,
            price: price
        }, function(res) {
            if (res.data.code == 0) {
                let data = res.data.data;
                that.wxPayment(data)
            }
        })
    },
    wxPayment: function(Payment) {
        let that = this;
        wx.requestPayment({
            'timeStamp': '' + Payment.timeStamp,
            'nonceStr': Payment.nonceStr,
            'package': Payment.wxPackage,
            'signType': 'MD5',
            'paySign': Payment.sign,
            'success': function(res) {
                let query = {
                    id:that.data.activityInfo.id,
                    userId:that.data.userId,
                    inviteId:that.data.inviteId,
                    originId:that.data.originId,
                }

                wx.navigateTo({
                    url: '/pages/crowdfunding/fpay/fpay'+JSON.stringify(query)
                })

            },
            'fail': function(res) {

            }
        })
    },
    qrcodePreview: function(e) {
        utils.qrcodeShow(e)
    },
    onShareAppMessage: function() {
        let query = 'id=' + this.data.activityInfo.id + '&userId=' + this.data.userId + '&inviteId=' + this.data.inviteId + '&originId=' + this.data.originId;
        return {
            title: app.globalData.userInfo.nickName + '正在参与"' + this.data.activityInfo.zcGoods.name + '"众筹项目，邀请您为他支持！',
            path: '/pages/crowdfunding/detail/detail?' + query,
            success: function(res) {
                console.log(query)
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },

})