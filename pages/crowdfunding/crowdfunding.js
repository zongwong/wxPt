import utils from "../../utils/util.js";
const app = getApp();
Page({
    data: {
        sortindex: 0,
        sortid: null,
        sort: [],
        activitylist: [],
        scrolltop: null,
        pageNo: 0,
        perpage: 5,
        scrollEnd: false,
        isajaxLoad: false,
    },
    onLoad: function(options) {
        app.tokenCheck(this.fetchPurchaseData);
    },
    fetchPurchaseData: function(userId='') {
        if (this.data.isajaxLoad) {
            return false;
        }
        const that = this;
        that.setData({
            isajaxLoad: true,
            pageNo: that.data.pageNo + 1
        })
        const pageNo = that.data.pageNo;

        utils.ajax('get', 'api/zc/zcActivity/list', {
            pageNo: pageNo,
            pageSize: 10,
            status: 0,
            userId: userId
        }, function(res) {
            that.setData({
                isajaxLoad: false,
            })
            if (typeof res.data.data === 'undefined') {
                that.setData({
                    scrollEnd: true
                })
                return false;
            }
            let list = res.data.data;
            list.forEach(function(item, index) {
                switch (item.status) {
                    case 1:
                        item.statusText = '众筹中';
                        break;
                    case 2:
                        item.statusText = '已下单';
                        break;
                    case 3:
                        item.statusText = '已过期';
                        break;
                }
            })
            let newactivitylist = that.data.activitylist.concat(list).concat(list);
            that.setData({
                activitylist: newactivitylist
            });
        })
    },
    goToTop: function() { //回到顶部
        this.setData({
            scrolltop: 0
        })
    },
    scrollLoading: function() { //滚动加载
        if (!this.data.scrollEnd) {
            this.fetchPurchaseData();
        }
    },
    scanCode: function() {
        var that = this;
        this.setData({
            pageNo: 0
        });
        wx.scanCode({
            success: (res) => {
                var userId = res.result;
                var memberInfo = that.data.memberInfo;
                memberInfo.userId = userId;
                that.setData({
                    memberInfo: memberInfo
                });

                this.fetchPurchaseData(userId);
            }
        })
    },
    startzc: function(event) {
        const actId = event.detial.dataset['actId'] || '';
        utils.ajax('POST', 'api/zc/zcOrder/save', {
            actId: actId,
            userId: app.globalData.memberId,
        }, function(res) {
            if (res.data.code == 0) {
                console.log(res);
            }
        })
    },
    onPullDownRefresh: function() {
        this.setData({
            page: 0,
            activitylist: []
        })
        this.fetchPurchaseData();
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 500)
    },
    onReachBottom: function() {
        if (!this.data.scrollEnd) {
            this.fetchPurchaseData();
        }
    },
    onShareAppMessage: function() {

    }
})