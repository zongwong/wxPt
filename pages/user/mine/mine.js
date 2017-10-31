// loadDataDistType: function () {
//   var fromServer = [];
//   for (var i = 0; i < 3; i++) {
//     var data = {
//       id: Math.floor(Math.random() * 10000) + '',
//       code: Math.floor(Math.random() * 100000000000) + '',
//       date: '2017-10-11',
//       name: '铠甲镀晶',
//       
//       myImg:'http://bryanly.oss-cn-shenzhen.aliyuncs.com/itembg.png',
//       count: Math.floor(Math.random() * 10) + '',
//       price: Math.floor(Math.random() * 1000)
//     }
//     fromServer.push(data);
//   }
//   this.setData({
//     myitems: fromServer
//   })
// }



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