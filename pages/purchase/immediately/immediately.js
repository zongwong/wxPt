import utils from "../../../utils/util.js";
import timeUtil from "../../../utils/timeUtil.js";
const app = getApp();
Page({
    data: {
        timeCountDown: '',
        endTime: '',
        activityInfo: null,
        imgUrls: [],
        friendInvite: false,
        inviteId: '',
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
        let inviteId = '';
        if (typeof options.type !== 'undefined' && options.type) {
            this.setData({
                friendInvite: options.type,
                inviteId: options.inviteId
            })
            inviteId = options.inviteId;
        }
        let that = this;

        utils.ajax('GET', 'api/pt/ptActivities/info', {
            actId: options.id,
            inviteId: inviteId,
        }, function(res) {
            if (res.data.code == 0) {
                let data = res.data.data;
                that.setData({
                    activityInfo: data,
                    endTime: data.endTime,
                });
                if (that.data.friendInvite) {
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
        });

    },
    onShareAppMessage: function() {
        let query = '?id=' + this.data.activityInfo.id;
        if (this.data.friendInvite) {
            query += '&type=true&inviteId=' + this.data.inviteId;
        }
        return {
            title: '我正在拼团快来帮忙',
            path: '/pages/immediately/immediately' + query,
            success: function(res) {
                console.log('转发成功' + res)
            },
            fail: function(res) {

            }
        }
    }
})