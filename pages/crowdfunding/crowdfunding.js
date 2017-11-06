import utils from "../../utils/util.js";
const app = getApp();
Page({
    data: {
        activitylist: [],
        scrolltop: null,
        pageNo: 0,
        scrollEnd: false,
        isajaxLoad: false,
        userId:14,
    },
    onLoad: function(options) {
        let that = this;

        app.tokenCheck(function(options) {

            try {
                let userId = wx.getStorageSync('userId');
                console.log('userId:' + userId);
                if (userId) {
                    that.setData({
                        userId: userId
                    })
                    that.fetchPurchaseData()
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
        let that = this;
        that.setData({
            isajaxLoad: true,
            pageNo: that.data.pageNo + 1
        })
        let pageNo = that.data.pageNo;
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
        let that = this;
        wx.scanCode({
            success: (res) => {
                let userId = res.result;
                if (typeof userId !== 'undefined' && userId) {
                    that.setData({
                        userId: userId,
                        pageNo: 0,
                        scrollEnd: false,
                    });
                    this.fetchPurchaseData();
                    wx.setStorageSync('userId',userId);
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '参数错误,请重新扫码'
                    })
                }
            }
        })
    },
    onPullDownRefresh: function() {
        if (!this.data.userId) {
            wx.stopPullDownRefresh();
            return false;
        }
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