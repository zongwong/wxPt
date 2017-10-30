import utils from "../../../utils/util.js";
const app = getApp();
Page({
    data: {
        myitems: [
        // {
        //     id: '1',
        //     code: '1',
        //     date: '2017-10-11',
        //     name: '铠甲镀晶',
        //     qrcodeImg: '../../../images/user/qrcode.png',
        //     myImg: 'http://bryanly.oss-cn-shenzhen.aliyuncs.com/itembg.png',
        //     count: '11',
        //     price: 11
        // }
        ],
        qrcodeImg: '../../../images/user/qrcode.png',
        isajaxLoad: false,
        scrollEnd: false,
        pageNo: 0,
    },
    onLoad: function(options) {
        app.tokenCheck(this.loadDataDistType);
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

        utils.ajax('get', 'api/cj/cjAwardDetail/myAward', {
            pageNo: pageNo,
            pageSize: 5,
            actId:1
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
                list.forEach(function(item){
                    item.createDate = item.createDate.slice(0,10)
                })

                let newactivitylist = that.data.myitems.concat(list);
                that.setData({
                    myitems: newactivitylist
                });
            }
        })

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
        utils.errImgFun(e, that , 'myImg' ,'../../../images/default_rect.png');
    },
    previewCode:function(e){
        utils.qrcodeShow(e)
    }
})