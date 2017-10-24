import utils from "../../../utils/util.js";
const app = getApp();
Page({
    data: {
        activitylist: [],
        status: 0,
        pageNo:0,
        scrollEnd:false,
    },
    onLoad: function(options) {
        this.fetchData(this.data.status);
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
        let that = this;
        const url = 'api/pt/ptGroupOrder/list';
        this.setData({
            pageNo:this.data.pageNo + 1
        })
        utils.ajax('get', url, {
            pageNo: this.data.pageNo,
            pageSize: 5,
            status: status,
        }, function(res) {
            if (typeof res.data.data === 'undefined') {
                console.log('没有数据');
                that.setData({
                    scrollEnd:true
                });
                return false;
            }
            let list = res.data.data;
            list.forEach(function(item,index){
              switch(item.status){
                  case 1:
                    item.statusText = '拼团中';
                    break;
                  default:
                    item.statusText = '已过期';
                    break;
              }
            })


            let newlist = that.data.activitylist.concat(list);
            that.setData({
                activitylist: newlist
            })
        })
    },
    onPullDownRefresh: function() {

    },
    scrollLoading: function() {
        if (!this.data.scrollEnd) {
            this.fetchData(this.data.status);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})