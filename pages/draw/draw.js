import utils from "../../utils/util.js";
Page({
    data: {
        sortindex: 0,
        sortid: null,
        sort: [],
        activitylist: [{
            "id": 1,
            "title": "VIP客户专享*幸运大转盘抽终身保养卡",
            "price": "0元博",
            "imgurl": "http://bryanly.oss-cn-shenzhen.aliyuncs.com/draw.png"
        }],
        scrolltop: null,
        pageNo: 0,
        isajaxLoad: false,
        scrollEnd: false,
    },
    onLoad: function(options) {
        this.fetchPurchaseData();
    },
    fetchPurchaseData: function() {

        if (this.data.isajaxLoad) {
            return false;
        }
        let that = this;
        that.setData({
            isajaxLoad: true,
            pageNo: that.data.pageNo + 1
        })
        const pageNo = that.data.pageNo;

        utils.ajax('GET', 'api/cj/cjActivity/list', {
            pageNo: pageNo,
            pageSize: 5,
            status: 0,
        }, function(res) {
            that.setData({
                isajaxLoad: false,
            })
            if (typeof res.data.data === 'undefined') {
                that.setData({
                    scrollEnd: true,
                })
                return false;
            }
            let list = res.data.data;

            let newactivitylist = that.data.activitylist.concat(list);
            that.setData({
                activitylist: newactivitylist
            });
        })




        // const perpage = 10;
        // this.setData({
        //   pageNo: this.data.pageNo + 1
        // })
        // const pageNo = this.data.pageNo;
        // const newlist = [];
        // for (var i = (pageNo - 1) * perpage; i < pageNo * perpage; i++) {
        //   newlist.push({
        //     "id": i + 1,
        //     "title": "VIP客户专享*幸运大转盘抽终身保养卡",
        //     "price": Math.floor(Math.random() * 10) + "元博",
        //     "imgurl": "http://bryanly.oss-cn-shenzhen.aliyuncs.com/draw.png"
        //   })
        // }
        // this.setData({
        //   activitylist: this.data.activitylist.concat(newlist)
        // })
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
            page: 0,
            activitylist: []
        })
        this.fetchPurchaseData();
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