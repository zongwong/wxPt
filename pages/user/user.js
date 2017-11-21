import utils from "../../utils/util.js";
const app = getApp();
Page({
    data: {
        activitylist: [],
        pageNo: 0,
        scrollEnd: false,
        isajaxLoad: false,
        userId: 17,
        originId:'',
        orderId:'',
    },
    onLoad: function(options) {
        let that = this;
        app.tokenCheck(function() {
            that.setData({
                originId:app.globalData.memberId
            })
            try {
                let userId = wx.getStorageSync('userId');
                console.log('userId:' + userId);
                if (userId) {
                    that.setData({
                        userId: userId
                    })
                    that.fetchPurchaseData();
                }
            } catch (e) {
                console.log(e)
            }

        });
    },
    scanCode: function(event) {
        let that = this;
        app.scanFunc(that,that.fetchPurchaseData);
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
        const pageNo = that.data.pageNo;

        const url = 'api/hx/hxActivity/list';

        utils.ajax('GET', url, {
            pageNo: pageNo,
            pageSize: 5,
            status: 1,
            userId: that.data.userId
        }, function(res) {
            that.setData({
                isajaxLoad: false,
            })
            app.loading('close');
            if (res.data.code == 0) {
                if (typeof res.data.data === 'undefined') {
                    that.setData({
                        scrollEnd: true,
                    })
                    return false;
                }
                let newactivitylist = that.data.activitylist.concat(res.data.data);
                that.setData({
                    activitylist: newactivitylist
                });
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
            activitylist: [],
            scrollEnd:false,
        })
        this.fetchPurchaseData();

        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 500)
    },
    onReachBottom: function() {
        if (!this.data.scrollEnd) {
            this.fetchPurchaseData();
        }
    },
    onShareAppMessage: function() {

    },
    imgError: function(e) {
        let that = this;
        utils.errImgFun(e, that);
    }
})