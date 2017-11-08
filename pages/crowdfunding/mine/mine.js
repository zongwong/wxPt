import utils from "../../../utils/util.js";
const app = getApp();
Page({
    data: {
        activitylist: [],
        status: 0,
        pageNo:0,
        scrollEnd:false,
        isajaxLoad: false,
    },
    onLoad: function(options) {
        let that = this;
        app.tokenCheck(function(){
            that.fetchData(that.data.status);
        })
        
    },
    changeTab: function(event) {
        var dataset = event.currentTarget.dataset;
        var status = +dataset['status'];
        this.setData({
            pageNo:0,
            scrollEnd:false,
            activitylist:[],
            status: status
        });
        this.fetchData(status);
    },
    fetchData: function(status) {
        if (this.data.isajaxLoad) {
            return false;
        }
        app.loading('open');
        let that = this;
        const url = 'api/zc/zcOrder/list';
        this.setData({
            pageNo:this.data.pageNo + 1
        })
        utils.ajax('get', url, {
            pageNo: this.data.pageNo,
            pageSize: 5,
            status: status,
        }, function(res) {
            that.setData({
                isajaxLoad: false,
            })
            app.loading('close');
            if (res.data.code == 0) {
                if (typeof res.data.data === 'undefined') {
                    console.log('没有数据');
                    that.setData({
                        scrollEnd:true
                    });
                    return false;
                }
                let newactivitylist = that.data.activitylist.concat(res.data.data);
                that.setData({
                    activitylist: newactivitylist
                })
            }
        })
    },
    onReachBottom: function() {
        if (!this.data.scrollEnd) {
            this.fetchData(this.data.status);
        }
    },
    onShareAppMessage: function() {

    },
    imgError: function(e) {
        let that = this;
        utils.errImgFun(e, that, "actImgUrl", "../../../images/default_rect.png");
    },
    qrcodeShow: function(e) {
        utils.qrcodeShow(e);
    }
})