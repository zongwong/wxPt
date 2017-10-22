import utils from "../../../utils/util.js";
const app = getApp();
Page({
    data: {
        activitylist: [{
                "actId": "1",
                "actImgUrl": "string",
                "actName": "string",
                "count": 5,
                "createDate": "2017-10-22T01:13:27.823Z",
                "groupNum": 1,
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
                "actImgUrl": "string",
                "actName": "string",
                "count": 5,
                "createDate": "2017-10-22T01:13:27.823Z",
                "groupNum": 1,
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
                "actImgUrl": "string",
                "actName": "string",
                "count": 5,
                "createDate": "2017-10-22T01:13:27.823Z",
                "groupNum": 1,
                "id": "1",
                "inviteId": "1",
                "isNewRecord": true,
                "redeemCode": "qwewqeqweqw",
                "remarks": "string",
                "status": 3,
                "updateDate": "2017-10-22T01:13:27.823Z",
                "userId": "string"
            }
        ],
        flag: 1,
        allCount: 3,
        donePurchase: {
            "id": 5,
            "name": "3人拼一元免费洗车10次",
            "status": "已结束",
            "pCode": "899773975584",
            "imgurl": "http://bryanly.oss-cn-shenzhen.aliyuncs.com/baozi.png"
        }
    },
    onLoad: function(options) {
        this.fetchData(this.data.allCount);
    },
    changeTab: function(event) {
        var dataset = event.currentTarget.dataset;
        var tab = +dataset['tab'];
        var status = +dataset['status'];
        this.setData({
            flag: tab
        });
        this.fetchData(status);
    },
    fetchData: function(status) {
        let that = this;
        const url = 'api/pt/ptGroupOrder/list';
        utils.ajax('get', url, {
            pageNo: 1,
            pageSize: 5,
            status: status,
        }, function(res) {
            let newlist;
            newlist = res.data.data;
            if (typeof newlist === 'undefined') {
                console.log('没有数据')
                return false;
            }
            that.setData({
                activitylist: newlist
            })
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})