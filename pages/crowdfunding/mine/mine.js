import utils from "../../../utils/util.js";
const app = getApp();
Page({
    data: {
        activitylist: [
        ],
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
        const url = 'api/zc/zcOrder/list';
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
            // let newlist = res.data.data;
            let newlist = [{
                "actId": "1",
                "actImgUrl": "",
                "actName": "string",
                "maxCount": 5,
                "createDate": "2017-10-22T01:13:27.823Z",
                "actualCount": 1,
                "id": "1",
                "inviteId": "1",
                "isNewRecord": true,
                "redeemCode": "qwewqeqweqw",
                "remarks": "string",
                "status": 1,
                "updateDate": "2017-10-22T01:13:27.823Z",
                "userId": "string"
            },
            {
                "actId": "1",
                "actImgUrl": "",
                "actName": "string",
                "maxCount": 5,
                "createDate": "2017-10-22T01:13:27.823Z",
                "actualCount": 1,
                "id": "1",
                "inviteId": "1",
                "isNewRecord": true,
                "redeemCode": "qwewqeqweqw",
                "remarks": "string",
                "status": 2,
                "updateDate": "2017-10-22T01:13:27.823Z",
                "userId": "string"
            },
            {
                "actId": "1",
                "actImgUrl": "",
                "actName": "string",
                "maxCount": 5,
                "createDate": "2017-10-22T01:13:27.823Z",
                "actualCount": 1,
                "id": "1",
                "inviteId": "1",
                "isNewRecord": true,
                "redeemCode": "qwewqeqweqw",
                "remarks": "string",
                "status": 3,
                "updateDate": "2017-10-22T01:13:27.823Z",
                "userId": "string"
            }
        ];
            newlist.forEach(function(item,index){
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
            let newactivitylist = that.data.activitylist.concat(newlist);
            that.setData({
                activitylist: newactivitylist
            })
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
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