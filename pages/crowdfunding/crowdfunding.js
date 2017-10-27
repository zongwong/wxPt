import utils from "../../utils/util.js";
const app = getApp();
Page({
    data: {
        activitylist: [],
        scrolltop: null,
        pageNo: 0,
        perpage: 5,
        scrollEnd: false,
        isajaxLoad: false,
        userId: 2,
    },
    onLoad: function(options) {
        let that = this;
        app.tokenCheck(function() {
            try {
                let userId = wx.getStorageSync('userId');
                console.log('userId:' + userId);
                if (userId) {
                    that.setData({
                        userId: userId
                    })
                    that.fetchPurchaseData(that.data.userId)
                } else {
                    that.fetchPurchaseData(that.data.userId)
                }
            } catch (e) {
                console.log(e)
            }

        });
    },
    fetchPurchaseData: function() {
        if (this.data.isajaxLoad) {
            return false;
        }
        app.loading('open');
        const that = this;
        that.setData({
            isajaxLoad: true,
            pageNo: that.data.pageNo + 1
        })
        const pageNo = that.data.pageNo;

        utils.ajax('get', 'api/zc/zcActivity/list', {
            pageNo: pageNo,
            pageSize: 10,
            status: 1,
            userId: that.data.userId
        }, function(res) {
            that.setData({
                isajaxLoad: false,
            })
            app.loading('close');
            if (typeof res.data.data === 'undefined') {
                that.setData({
                    scrollEnd: true
                })
                return false;
            }

            let newactivitylist = that.data.activitylist.concat(res.data.data);
            that.setData({
                activitylist: newactivitylist
            });
        })
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
    onPullDownRefresh: function() {
        this.setData({
            pageNo: 0,
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
    imgError: function(e) {
        let that = this;
        utils.errImgFun(e, that);
    },
    onShareAppMessage: function() {

    }
})