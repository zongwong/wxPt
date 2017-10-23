const utils = require('../../../utils/util.js');
import timeUtil from "../../../utils/timeUtil.js";
const app = getApp();
Page({
    data: {
        timeCountDown: '',
        endTime: '',
        activityInfo: null,
        imgUrls: [
            'http://bryanly.oss-cn-shenzhen.aliyuncs.com/baozi.png',
            'http://bryanly.oss-cn-shenzhen.aliyuncs.com/car.png',
            'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        friendInvite: false,
        menbers: [{
                "face": "../../images/icon_07.png",
                "name": "中途小妹",
                "time": "2017/09/23"
            },
            {
                "face": "../../images/icon_05.png",
                "name": "中途小di",
                "time": "2017/09/23"
            }
        ],
        indicatorDots: true,
        indicatorActivColor: '#E12F25',
        autoplay: true,
        interval: 5000,
        duration: 1000,
        house: '../../../images/pintuan/house.png',
        addr: '../../../images/pintuan/addr.png',
        triangleImg: '../../../images/pintuan/ddd.png'
    },
    calling: function(event) {
        var dataset = event.currentTarget.dataset;
        var telNum = dataset['tel'];
        utils.phoneCallFn(telNum);
    },
    onLoad: function(options) {
        if (typeof options.type !== 'undefined' && options.type) {
            this.setData({
                friendInvite: options.type
            })
        }
        var that = this;
        var url = 'api/pt/ptActivities/info';
        utils.ajax('get', url, {
            actId: options.id,
            // inviteId: options.options
        }, function(res) {
            var data = res.data.data;
            console.log(data)
            if (data) {
                that.setData({
                    activityInfo: data,
                    endTime: data.endTime
                })
            }
        });

        setInterval(function() {
            that.setData({
                timeCountDown: timeUtil.countDown(that.data.endTime)
            })
        }, 1000);

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