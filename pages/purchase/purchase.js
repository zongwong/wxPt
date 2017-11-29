import utils from "../../utils/util.js";
const app = getApp();
Page({
    data: {
        activitylist: [],
        pageNo: 0,
        scrollEnd: false,
        isajaxLoad: false,
        userId: 1,
    },
    onLoad: function(options) {
        let that = this;
        utils.userInfoCb(app);
        app.tokenCheck(function() {
            try {
                let userId = wx.getStorageSync('userId');
                console.log('本地userId:' + userId);
                if (userId) {
                    that.setData({
                        userId: userId
                    })
                    if (typeof options.load === 'undefined') {
                        that.fetchPurchaseData(function(data){
                            if (typeof data != 'undefined' && data.length==1 ) {
                                wx.navigateTo({
                                    url:'/pages/purchase/immediately/detail?id='+data[0].id+'&userId='+that.data.userId+'&originId='+app.globalData.memberId
                                })
                            }
                        });
                    }else{
                        that.fetchPurchaseData();
                    }
                }
            } catch (e) {
                console.log(e)
            }
            
        });
    },
    scanCode: function(event) {
        let that = this;
        wx.scanCode({
            success: (res) => {
                console.log(res)
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
    fetchPurchaseData: function(fn) {
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

        const url = 'api/pt/ptActivities/list';

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
            fn && fn();
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
        },function(res){
            console.log(res)
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