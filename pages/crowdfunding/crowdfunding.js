import utils from "../../utils/util.js";
const app = getApp();
Page({
    data: {
        sortindex: 0,
        sortid: null,
        sort: [],
        activitylist: [{
                "id": "1",
                "isNewRecord": false,
                "createDate": "2017-10-19 11:34:05",
                "updateDate": "2017-10-19 14:42:39",
                "merchantId": "1",
                "goodsId": "2",
                "storeId": "3",
                "name": "众筹活动",
                "imgUrl": "",
                "beginTime": "2017-10-09",
                "endTime": "2017-10-09",
                "num": 0,
                "saleNum": 0,
                "saleRemarks": "消费提示",
                "status": 1,
                "statusText":'众筹中',
                "payPrice": 1,
                "discountPrice": 50,
                "maxCount": 3,
                "storeName": "门店1",
                "storeAddress": "泉州市丰泽区",
                "zcGoods": {
                    "id": "2",
                    "isNewRecord": false,
                    "merchantId": "1",
                    "name": "12321312",
                    "originalPrice": 500,
                    "price": 300,
                    "count": 100,
                    "videoUrl": "",
                    "imgUrl": ""
                }
            }

        ],
        scrolltop: null,
        pageNo: 0,
        perpage: 5,
        scrollEnd: false,
    },
    onLoad: function(options) {
        app.toLogin(this.fetchPurchaseData);
    },
    fetchPurchaseData: function() {
        const that = this;
        that.setData({
            pageNo: that.data.pageNo + 1
        })
        const pageNo = that.data.pageNo;

        const url = 'api/zc/zcActivity/list';

        utils.ajax('get', url, {
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
            let newactivitylist = that.data.activitylist.concat(list);
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
    scanCode:function(){
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