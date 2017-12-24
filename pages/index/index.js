// pages/index/index.js
import utils from "../../utils/util.js";
const app = getApp();
Page({
    data: {},
    onLoad: function() {
        utils.userInfoCb(app);
    },
    scanCode: function(event) {
        let that = this;
        let url = event.currentTarget.dataset.url;
        wx.scanCode({
            success: (res) => {
                let userId;
                if(res.path){
                    userId = res.path.split('=')[1];
                }
                if(res.result){
                    userId = res.result;
                }
                console.log(userId);
                if (typeof userId !== 'undefined' && userId) {
                    wx.setStorageSync('userId', userId);
                    wx.navigateTo({
                        url: url
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '参数错误,请重新扫码'
                    })
                }
            }
        })
    },
    onShareAppMessage: function() {

    }
})