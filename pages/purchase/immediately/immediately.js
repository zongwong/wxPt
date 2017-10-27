import utils from "../../../utils/util.js";
import timeUtil from "../../../utils/timeUtil.js";
const app = getApp();
Page({
    data: {
        timeCountDown: '获取中...',
        endTime: '',
        activityInfo: null,
        imgUrls: [],
        friendInvite: false,
        inviteId: '',
        userId:'',
        menbers: [],
        indicatorDots: true,
        indicatorActivColor: '#E12F25',
        autoplay: true,
        interval: 5000,
        duration: 1000,
        house: '../../../images/pintuan/house.png',
        addr: '../../../images/pintuan/addr.png',
        triangleImg: '../../../images/pintuan/ddd.png'
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
        }else{
            wx.showModal({
                title:'提示',
                content:'参数错误,请重新进入',
                success:function(){
                    wx.switchTab({
                        url:'/pages/purchase/purchase'
                    })
                }
            })
            return false;
        }
        if (typeof options.type !== 'undefined') {
            this.setData({
                friendInvite: true,
            })
        }
        if (typeof options.inviteId !== 'undefined' && options.inviteId) {
            this.setData({
                inviteId: options.inviteId
            })
        }
        let that = this;
        utils.ajax('GET', 'api/pt/ptActivities/info', {
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
                        item.time = utils.formatTime(item.ptDate)
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
                              url: '/pages/purchase/purchase'
                            })
                          }
                    })
                }else if ( endtime === '活动已结束') {
                    wx.showModal({
                          title: '提示',
                          content: '来晚啦,活动已结束~',
                          success: function(res) {
                            wx.switchTab({
                              url: '/pages/purchase/purchase'
                            })
                          }
                    })
                }else{
                    setInterval(function() {
                        that.setData({
                            timeCountDown: timeUtil.countDown(that.data.endTime)
                        })
                    }, 1000);
                }
            }
        });

    },
    onShareAppMessage: function() {
        // ?差一个判断 是不是自己点进来
        let query = '?id=' + this.data.activityInfo.id + '&inviteId=' + this.data.inviteId + '&userId='+this.data.userId;
        // if (this.data.friendInvite) {
        //     query += '&type=true&inviteId=' + this.data.inviteId + '&userId='+this.data.userId;
        // }
        console.log(query)
        return {
            title: '我正在拼团快来',
            path: '/pages/purchase/immediately/immediately' + query,
            success: function(res) {
                console.log('转发成功' + res)
            },
            fail: function(res) {

            }
        }
    }
})