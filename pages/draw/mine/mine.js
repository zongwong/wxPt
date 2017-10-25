import utils from "../../../utils/util.js";
const app = getApp();
Page({
    data: {
        myitems: [{
            id: '1',
            code: '1',
            date: '2017-10-11',
            name: '铠甲镀晶',
            qrcodeImg: '../../../images/user/qrcode.png',
            myImg: 'http://bryanly.oss-cn-shenzhen.aliyuncs.com/itembg.png',
            count: '11',
            price: 11
        }],
        isajaxLoad: false,
        scrollEnd: false,
        pageNo: 0,
    },
    onLoad: function(options) {
        app.checkToken(this.loadDataDistType);
    },
    loadDataDistType: function() {

        if (this.data.isajaxLoad) {
            return false;
        }
        const that = this;
        that.setData({
            isajaxLoad: true,
            pageNo: that.data.pageNo + 1
        })
        const pageNo = that.data.pageNo;

        utils.ajax('get', 'api/cj/cjAwardDetail/myAward', {
            pageNo: pageNo,
            pageSize: 5,
            status: 1,
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

            let newactivitylist = that.data.myitems.concat(list).concat(list);
            that.setData({
                myitems: newactivitylist
            });
        })

    },
    onPullDownRefresh: function() {
        this.setData({
            page: 0
        })
        this.fetchSortData();
        setTimeout(() => {
            wx.stopPullDownRefresh()
        }, 500)
    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {

    }
})