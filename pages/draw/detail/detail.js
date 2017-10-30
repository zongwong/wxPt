import utils from "../../../utils/util.js";
const app = getApp();
Page({
    data: {
        descImg: 'http://bryanly.oss-cn-shenzhen.aliyuncs.com/shuo.png',
        drawImg: 'http://bryanly.oss-cn-shenzhen.aliyuncs.com/chou.png',
        chanceCount: 1,
        //大转盘实例
        btnDrawImg: 'http://bryanly.oss-cn-shenzhen.aliyuncs.com/btndraw.png',
        circleList: [], //圆点数组
        awardList: [], //奖品数组
        colorCircleFirst: '#FFDF2F', //圆点颜色1
        colorCircleSecond: '#FE4D32', //圆点颜色2 //#FFDC7E
        colorAwardDefault: '#F5F0FC', //奖品默认颜色
        colorAwardSelect: '#F3365E', //奖品选中颜色
        indexSelect: 0, //被选中的奖品index
        resultIndex: '',
        isRunning: false, //是否正在抽奖
        activitylist: null,
        imageAward: [], //奖品图片数组
        recordsList: [{
            id: "1",
            tel: "177*****443",
            goodName: "铠甲镀晶"
        }],
        actId: '',
        userId: 14
    },
    onLoad: function(options) {
        let that = this;
        app.tokenCheck(function() {
            let actId = options.id;
            that.setData({
                userId: options.userId,
                actId: actId
            })
            that.getInfo(actId);
            
        })
    },
    goToMyAward: function(event) {
        wx.redirectTo({
            url: '../mine/mine',
        })
    },
    getInfo: function(actId) {
        let that = this;
        utils.ajax('GET', 'api/cj/cjActivityMember/info', {
            actId: actId,
            userId: that.data.userId
        }, function(res) {
            if (res.data.code == 0) {
                that.setData({
                    activitylist: res.data.data
                })

                let awards = res.data.data.awards;
                let dir = 8 - awards.length;
                for (let i = 0; i < dir; i++) {
                    awards.push({
                        actId: "-1",
                        awardOdds: 0.1,
                        id: "-1",
                        imgUrl: "2",
                        name: "再接再厉",
                        num: 0,
                        price: 0,
                    });
                }
                that.setData({
                    imageAward: awards
                })
                that.loadDrawGame();


            }
        });
    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {
        let that = this;
        return {
            title:'抽奖',
            success:function(){
                utils.ajax('POST', 'api/cj/cjActivity/share', {
                    actId: that.data.actId,
                    userId: that.data.userId
                }, function(res) {
                    if (res.data.code == 0) {
                        let num = that.data.activitylist.memberCount + that.data.activitylist.shareCount;
                        that.setData({
                            'activitylist.memberCount':num
                        })


                    }
                });
            }
        }
    },
    loadDrawGame: function() {
        var _this = this;
        //圆点设置
        var leftCircle = 7.5;
        var topCircle = 7.5;
        var circleList = [];
        for (var i = 0; i < 24; i++) {
            if (i == 0) {
                topCircle = 15;
                leftCircle = 15;
            } else if (i < 6) {
                topCircle = 7.5;
                leftCircle = leftCircle + 102.5;
            } else if (i == 6) {
                topCircle = 15
                leftCircle = 620;
            } else if (i < 12) {
                topCircle = topCircle + 94;
                leftCircle = 620;
            } else if (i == 12) {
                topCircle = 565;
                leftCircle = 620;
            } else if (i < 18) {
                topCircle = 570;
                leftCircle = leftCircle - 102.5;
            } else if (i == 18) {
                topCircle = 565;
                leftCircle = 15;
            } else if (i < 24) {
                topCircle = topCircle - 94;
                leftCircle = 7.5;
            } else {
                return
            }
            circleList.push({ topCircle: topCircle, leftCircle: leftCircle });
        }
        this.setData({
            circleList: circleList
        })

        //圆点闪烁
        // setInterval(function() {
        //     if (_this.data.colorCircleFirst == '#FFDF2F') {
        //         _this.setData({
        //             colorCircleFirst: '#FE4D32',
        //             colorCircleSecond: '#FFDF2F',
        //         })
        //     } else {
        //         _this.setData({
        //             colorCircleFirst: '#FFDF2F',
        //             colorCircleSecond: '#FE4D32',
        //         })
        //     }
        // }, 500) //设置圆点闪烁的效果

        //奖品item设置
        var awardList = [];
        //间距,怎么顺眼怎么设置吧.
        var topAward = 25;
        var leftAward = 25;
        for (var j = 0; j < 8; j++) {
            if (j == 0) {
                topAward = 25;
                leftAward = 25;
            } else if (j < 3) {
                topAward = topAward;
                //166.6666是宽.15是间距.下同
                leftAward = leftAward + 166.6666 + 15;
            } else if (j < 5) {
                leftAward = leftAward;
                //150是高,15是间距,下同
                topAward = topAward + 150 + 15;
            } else if (j < 7) {
                leftAward = leftAward - 166.6666 - 15;
                topAward = topAward;
            } else if (j < 8) {
                leftAward = leftAward;
                topAward = topAward - 150 - 15;
            }
            var imageAward = this.data.imageAward[j];
            awardList.push({ topAward: topAward, leftAward: leftAward, imageAward: imageAward });
        }
        this.setData({
            awardList: awardList
        })
    },
    getResult: function(fn) {
        let that = this;
        utils.ajax('POST', 'api/cj/cjAwardDetail/save', {
            actId: that.data.actId,
            userId: that.data.userId
        }, function(res) {

            if (res.data.code == 0) {
                let data = res.data.data;
                if (data.isAward) {
                    let num = that.data.activitylist.memberCount - 1;
                    that.setData({
                        'activitylist.memberCount':num
                    })
                    
                    const result = {};
                    result.awardName = data.awardName;
                    result.awardId = data.awardId;

                    that.data.imageAward.forEach(function(item, index) {
                        if (item.awardId === result.awardId && item.awardName === result.awardName) {
                            that.setData({
                                resultIndex: index
                            })
                        }
                    })

                } else {
                    that.setData({
                        resultIndex: -1
                    })
                }
                fn && fn();
            }else{
                wx.showModal({
                    title:'提示',
                    content:res.data.message+',快去分享给好友吧~'
                })
                that.setData({
                    isRunning: false
                })
            }
        });
    },
    //开始抽奖
    startGame: function() {
        if (this.data.isRunning) return
        this.setData({
            isRunning: true
        })
        let that = this;
        this.getResult(function(){

        
        
            var indexSelect = that.data.indexSelect;
            var start = that.data.indexSelect;
            var i = 0;
            // var randomMaxCount = Math.floor(Math.random() * 1000);

            var timer = setInterval(function() {
                indexSelect += 1;
                //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
                i += 30;
                console.log(indexSelect)
                if (indexSelect >= (8 * 3 + start)) {
                    //去除循环

                    let dir = that.data.resultIndex - (that.data.indexSelect);
                    dir = dir >= 0 ? dir : (8 - Math.abs(dir));
                    console.log(dir, that.data.resultIndex, that.data.indexSelect)
                    // console.log(that.data.resultIndex , that.data.indexSelect,dir);
                    if (dir === 0) {
                        clearInterval(timer)
                        //获奖提示
                        var award = that.data.awardList[that.data.resultIndex];
                        wx.showModal({
                            title: '恭喜您中奖',
                            content: '奖品：' + award.imageAward.name,
                            showCancel: false, //去掉取消按钮
                            success: function(res) {
                                if (res.confirm) {
                                    that.setData({
                                        isRunning: false,
                                    })
                                }
                            }
                        })
                    } else {
                        let ii = (that.data.indexSelect + 1) % 8;
                        // console.log(ii)
                        that.setData({
                            indexSelect: ii
                        })
                    }
                } else {

                    let aa = indexSelect % 8;
                    that.setData({
                        indexSelect: aa
                    })
                }
            }, (200 + i))

        });
    },
    imgError: function(e) {
        let that = this;
        utils.errImgFun(e, that ,'imageAward.imgUrl','../../../images/default_rect.png');
    }
})