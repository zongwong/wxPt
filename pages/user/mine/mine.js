import utils from "../../../utils/util.js";
const app = getApp();
Page({
    data: {
        myitems: [],
        qrcodeImg: '../../../images/user/qrcode.png',
        isajaxLoad: false,
        scrollEnd: false,
        pageNo: 0,
        activeTab: true,
        userId:'',
        originId:'',
        orderId:'',
    },
    onLoad: function(options) {
        let that= this;
        app.tokenCheck(function(){
            that.setData({
                originId:app.globalData.memberId
            })
            that.loadDataDistType()
        });
    },
    loadDataDistType: function() {

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
        let url = '';
        if (that.data.activeTab) {
            url = 'api/hx/hxAwardDetail/myAward';
        } else {
            url = 'api/hx/hxAwardDetail/myLottery';
        }
        utils.ajax('get', url, {
            pageNo: pageNo,
            pageSize: 5,
            actId: 1
        }, function(res) {
            that.setData({
                isajaxLoad: false,
            })
            app.loading('close');
            if (res.data.code == 0) {

                if (typeof res.data.data === 'undefined') {
                    that.setData({
                        scrollEnd: true
                    })
                    return false;
                }
                let list = res.data.data;
                list.forEach(function(item) {
                    item.createDate = item.createDate.slice(0, 10)
                })

                let newactivitylist = that.data.myitems.concat(list);
                that.setData({
                    myitems: newactivitylist
                });
            }
        })

    },
    changeTab: function(event) {
        var dataset = event.currentTarget.dataset;
        var type = dataset['type'];
        var flag = true;
        if (type == 'award' && this.data.activeTab) {
            flag = flag;

        } else if (type == 'draw') {
            flag = !flag;
        }
        this.setData({
            activeTab: flag,
            scrollEnd: false,
            myitems: [],
            pageNo: 0
        });
        this.loadDataDistType();
    },
    onPullDownRefresh: function() {
        this.setData({
            pageNo: 0,
            myitems: []
        })
        this.loadDataDistType();

        setTimeout(() => {
            wx.stopPullDownRefresh();
        }, 500)
    },
    onReachBottom: function() {
        if (!this.data.scrollEnd) {
            this.loadDataDistType();
        }
    },
    onShareAppMessage: function() {

    },
    imgError: function(e) {
        let that = this;
        utils.errImgFun(e, that, 'imgUrl', '../../../images/default_rect.png');
    },
    previewCode: function(e) {
        utils.qrcodeShow(e)
    }
})