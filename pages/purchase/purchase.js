import utils from "../../utils/util.js";
const app = getApp();
Page({
    data: {
        activitylist: [],
        pageNo: 0,
        memberInfo: null,
        scrollEnd: false,
        isajaxLoad: false,
    },
    onLoad: function(options) {
        app.tokenCheck(this.fetchPurchaseData);
    },
    scanCode: function(event) {
        let that = this;
        this.setData({
            pageNo: 0,
            scrollEnd: false,
        });
        wx.scanCode({
            success: (res) => {
                let userId = res.result;
                let memberInfo = that.data.memberInfo;
                memberInfo.userId = userId;
                that.setData({
                    memberInfo: memberInfo
                });
                this.fetchPurchaseData(userId);
            }
        })
    },
    fetchPurchaseData: function(userId = '') {
        if (this.data.isajaxLoad) {
            return false;
        }

        let that = this;
        that.setData({
            isajaxLoad: true,
            pageNo: that.data.pageNo + 1
        })
        const pageNo = that.data.pageNo;

        const url = 'api/pt/ptActivities/list';

        utils.ajax('GET', url, {
            pageNo: pageNo,
            pageSize: 5,
            status: 1,
            userId: userId
        }, function(res) {
            that.setData({
                isajaxLoad: false,
            })
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
    onShareAppMessage: function() {

    },
    imgError:function(e){
        let that = this;
        utils.errImgFun(e,that);
    }
})