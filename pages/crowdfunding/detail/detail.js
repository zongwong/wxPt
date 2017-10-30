const utils = require('../../../utils/util.js');
import timeUtil from "../../../utils/timeUtil.js";
const app = getApp();
Page({
    data: {
        imgUrls: [],
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
        triangleImg: '../../../images/funding/ddd.png',
        inviteId: '',
        originId:'',
        isMyself:true,
        iInList:false,
        menbers: [],
        userId:'',
    },
    calling: function(event) {
        var dataset = event.currentTarget.dataset;
        var telNum = dataset['tel'];
        utils.phoneCallFn(telNum);
    },
    onLoad: function(options) {
        if (typeof options.userId !== 'undefined' && options.userId) {
            this.setData({
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

        if (typeof options.inviteId !== 'undefined' && options.inviteId) {
            this.setData({
                inviteId: options.inviteId
            })
        }
        if (typeof options.originId !== 'undefined' && options.originId) {
            this.setData({
                originId: options.originId,
            })
            //判断众筹单是不是自己发起的
            if (options.originId != app.globalData.memberId) {
                this.setData({
                    isMyself:false
                })
            }
        }


        let that = this;
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
                if (typeof data.memberList !== 'undefined' && data.memberList.length) {
                    let memberList = data.memberList;
                    memberList.forEach(function(item) {
                        item.time = utils.formatTime(item.ptDate);
                        //判断自己是否在列表
                        if (item.memberId == app.globalData.memberId) {
                            that.setData({
                                iInList:true
                            })
                        }
                    })
                    that.setData({
                        menbers: memberList,
                    })
                }
                let endtime = timeUtil.countDown(that.data.endTime);

                if (!endtime) {
                    wx.showModal({
                        title: '提示',
                        content: '时间错误',
                        success: function(res) {
                            wx.switchTab({
                                url: '/pages/crowdfunding/crowdfunding'
                            })
                        }
                    })
                } else if (endtime === '活动已结束') {
                    wx.showModal({
                        title: '提示',
                        content: '来晚啦,活动已结束~',
                        success: function(res) {
                            wx.switchTab({
                                url: '/pages/crowdfunding/crowdfunding'
                            })
                        }
                    })
                } else {
                    setInterval(function() {
                        that.setData({
                            timeCountDown: timeUtil.countDown(that.data.endTime)
                        })
                    }, 1000);
                }
            }
        })
    },
    startzc: function(actId) {
        let that = this;
        utils.ajax('POST', 'api/zc/zcOrder/save', {
            actId: actId,
            userId: userId,
        }, function(res) {

            if (res.data.code == 0) {
                that.setData({
                    orderId: res.data.data.orderNumber
                })
            }
        })
    },
    onPullDownRefresh: function() {

    },

    onReachBottom: function() {

    },
    onShareAppMessage: function() {
        return {
            title: app.globalData.userInfo.nickName + '正在参与"' + this.data.activityInfo.zcGoods.name + '"众筹项目，邀请您为他支持！',
            path: '/pages/crowdfunding/detail/detail?id=&userId&inviteId&originId',
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }
        }
    },
    payImmediately: function(event) {
        let that = this;
        let isHelp = 0;
        let price = that.data.activityInfo.zcGoods.price;
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
            price:price
        }, function(res) {
            if (res.data.code == 0) {
                let data = res.data.data;
                that.wxPayment(data)
            }
        })
    }

})