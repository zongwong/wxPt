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
        memberInfo: null,
        scrollEnd: false,
    },
    onLoad: function(options) {
        console.log('onload了')
        app.toLogin(this.fetchPurchaseData);
        this.fetchPurchaseData()

    },
    scanCode: function(event) {
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

                this.fetchPurchaseData();
            }
        })
    },
    fetchPurchaseData: function() {
        var that = this;
        that.setData({
            pageNo: that.data.pageNo + 1
        })
        const pageNo = that.data.pageNo;

        var url = 'api/pt/ptActivities/list';

        utils.ajax('GET', url, {
            pageNo: pageNo,
            pageSize: 10,
            status: 0
        }, function(res) {
            if (typeof res.data.data === 'undefined') {
                that.setData({
                    scrollEnd: true
                })
                return false;
            }
            let list = res.data.data;

            list.forEach(function(item,index){
              switch(item.status){
                  case 1:
                    item.statusText = '拼团中';
                    break;
                  case 2:
                    item.statusText = '已过期';
                    break;
                  case 3:
                    item.statusText = '已过期';
                    break;
                  default:
                    item.statusText = '已过期';
                    break;
              }
            })
            let newactivitylist = that.data.activitylist.concat(list);
            that.setData({
                activitylist: newactivitylist
            });

        })
    },
    goToTop: function() {
        this.setData({
            scrolltop: 0
        })
    },
    scrollLoading: function() {
        if (!this.data.scrollEnd) {
            this.fetchPurchaseData();
        }
    },
    onPullDownRefresh: function() {
        this.setData({
            pageNo: 0,
            activitylist: []
        })
        this.fetchPurchaseData(this.data.memberInfo);
        this.fetchSortData();
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 1000)
    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {

    }
})