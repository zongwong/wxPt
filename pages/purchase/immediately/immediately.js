import utils from "../../../utils/util.js";
import timeUtil from "../../../utils/timeUtil.js";
const app = getApp();
Page({
    data: {
        timeCountDown: '获取中...',
        endTime: '',
        activityInfo: null,
        goodsImgs: [],
        inviteId: '',
        userId:'',
        menbers: [],
        iInList:false,
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
        let that = this;
        console.log(options)
        utils.userInfoCb(app);
        //判断userId 必须有
        app.tokenCheck(function(){
            if (typeof options.userId !== 'undefined' && options.userId) {
                that.setData({
                    userId: options.userId
                })
            }else{
                wx.showModal({
                    title:'提示',
                    content:'userId错误,请扫码进入',
                    success:function(){
                        wx.navigateTo({
                            url:'/pages/purchase/purchase'
                        })
                    }
                })
                return false;
            }
            //判断inviteId ,有就是开团的,没有就是没开团
            if (typeof options.inviteId !== 'undefined' && options.inviteId) {
                that.setData({
                    inviteId: options.inviteId
                })
            }

            
            utils.ajax('GET', 'api/pt/ptActivities/info', {
                actId: options.id,
                inviteId: that.data.inviteId,
            }, function(res) {
                if (res.data.code == 0) {
                    let data = res.data.data;
                    that.setData({
                        activityInfo: data,
                        endTime: data.endTime,
                    });
                    if (typeof data.memberList !== 'undefined' && data.memberList.length) {
                        let memberList = data.memberList;
                        memberList.forEach(function(item) {
                            item.time = utils.formatTime(item.ptDate);
                            //判断自己是否在拼团列表
                            if (item.memberId == app.globalData.memberId) {
                                that.setData({
                                    iInList:true
                                })
                            }
                        })
                        that.setData({
                            menbers: memberList,
                        })
                    }
                    // 商品img处理
                    let goodsImgs = data.ptGood.imgUrl.split(',')
                    that.setData({
                        goodsImgs:goodsImgs
                    })
                    //时间处理
                    let endtime = timeUtil.countDown(that.data.endTime);

                    if (!endtime) {
                        wx.showModal({
                              title: '提示',
                              content: '时间错误',
                              success: function(res) {
                                // wx.navigateTo({
                                //   url: '/pages/purchase/purchase'
                                // })
                              }
                        })
                    }else if ( endtime === '活动已结束') {
                        wx.showModal({
                              title: '提示',
                              content: '来晚啦,活动已结束~',
                              success: function(res) {
                                // wx.navigateTo({
                                //   url: '/pages/purchase/purchase'
                                // })
                              }
                        })
                    }else{
                        setInterval(function() {
                            that.setData({
                                timeCountDown: timeUtil.countDown(that.data.endTime)
                            })
                        }, 1000);
                    }
                }
            });
        })

    },
    onShareAppMessage: function() {

        let query = '?id=' + this.data.activityInfo.id + '&inviteId=' + this.data.inviteId + '&userId='+this.data.userId;
        console.log('拼团分享url:'+query)
        return {
            title: '我正在拼团快来啊~',
            path: '/pages/purchase/immediately/immediately' + query,
            imageUrl:this.data.goodsImgs[0],
            success: function(res) {
                console.log('拼团转发成功')
            },
            fail: function(res) {

            }
        }
    }
})