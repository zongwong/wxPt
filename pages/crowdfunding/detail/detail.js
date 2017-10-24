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
        friendPay: false,
        inviteId: '',
        menbers: [],
    },
    calling: function(event) {
        var dataset = event.currentTarget.dataset;
        var telNum = dataset['tel'];
        utils.phoneCallFn(telNum);
    },
    onLoad: function(options) {
        wx.setNavigationBarTitle({
            title: '众筹-' + options.name,
        });

        let inviteId = '';
        if (typeof options.friendPay !== 'undefined' && options.friendPay) {
            this.setData({
                friendPay: options.friendPay,
                inviteId: options.inviteId
            })
            inviteId = options.inviteId;
        }
        let that = this;
        utils.ajax('GET', 'api/zc/zcActivity/info', {
            actId: options.id,
            inviteId: inviteId,
        }, function(res) {

            if (res.data.code == 0) {
                let data = res.data.data;
                that.setData({
                    activityInfo: data,
                    endTime: data.endTime,
                });
                if (that.data.friendPay) {
                    let memberList = data.memberList;
                    memberList.forEach(function(item) {
                        item.time = utils.formatTime(item.ptDate)
                    })
                    that.setData({
                        menbers: memberList,
                    })
                }
                setInterval(function() {
                    that.setData({
                        timeCountDown: timeUtil.countDown(that.data.endTime)
                    })
                }, 500);
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
            path: '/pages/crowdfunding?type=true&userId=',
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
        let isHelp = 1;
        if (this.data.friendPay){
          isHelp=0;
        }
        utils.ajax('POST', 'api/zc/zcOrder/pay', {
            orderId: 1,
            type: 1,
            isHelp: isHelp,
            userId: app.globalData.memberId,
        }, function(res) {
            if (res.data.code == 0) {
                let data = res.data.data;
                that.wxPayment(data)
            }
        })
    }

})