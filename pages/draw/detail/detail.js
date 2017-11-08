import utils from "../../../utils/util.js";
const app = getApp();
Page({
    data: {
        descImg: 'http://bryanly.oss-cn-shenzhen.aliyuncs.com/shuo.png',
        drawImg: 'http://bryanly.oss-cn-shenzhen.aliyuncs.com/chou.png',
        //大转盘实例
        circleList: [], //圆点数组
        awardList: [], //奖品数组
        colorCircleFirst: '#FFDF2F', //圆点颜色1
        colorCircleSecond: '#FE4D32', //圆点颜色2 //#FFDC7E
        colorAwardDefault: '#fff', //奖品默认颜色
        colorAwardSelect: '#fff000', //奖品选中颜色
        indexSelect: 0, //被选中的奖品index
        resultIndex: '',
        isRunning: false, //是否正在抽奖
        activitylist: null,
        imageAward: [], //奖品图片数组
        actId: '',
        userId: 14,
        awardsRecord:[],
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
                let data = res.data.data;
                that.setData({
                    activitylist: data
                })


                // 奖项处理 不足八个 补全未中奖
                let awards = data.awards;
                let dir = 8 - awards.length;
                for (let i = 0; i < dir; i++) {
                    awards.push({
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

                //中奖记录处理
                if (typeof data.awardDetails != 'undefined') {
                    let awards = Array.from(data.awardDetails);

                    let awardsRecord = awards.filter(function(item, index) {
                        return (item.isAward == 1)
                    })

                    that.setData({
                        awardsRecord: awardsRecord.slice(0, 1)
                    })
                    let start = 0;
                    if (awardsRecord.length >= 2) {

                        setInterval(function() {
                            start += 1;
                            if (start > awardsRecord.length - 1) {
                                start = 0;
                            }
                            let nowList = awardsRecord.slice(start, start + 1)
                            that.setData({
                                awardsRecord: nowList
                            })
                        }, 2000)
                    } else {
                        that.setData({
                            awardsRecord: awardsRecord
                        })
                    }
                }



            }
        });
    },
    loadDrawGame: function() {
        var _this = this;
        //圆点设置
        // var leftCircle = 7.5;
        // var topCircle = 7.5;
        // var circleList = [];
        // for (var i = 0; i < 24; i++) {
        //     if (i == 0) {
        //         topCircle = 15;
        //         leftCircle = 15;
        //     } else if (i < 6) {
        //         topCircle = 7.5;
        //         leftCircle = leftCircle + 102.5;
        //     } else if (i == 6) {
        //         topCircle = 15
        //         leftCircle = 620;
        //     } else if (i < 12) {
        //         topCircle = topCircle + 94;
        //         leftCircle = 620;
        //     } else if (i == 12) {
        //         topCircle = 565;
        //         leftCircle = 620;
        //     } else if (i < 18) {
        //         topCircle = 570;
        //         leftCircle = leftCircle - 102.5;
        //     } else if (i == 18) {
        //         topCircle = 565;
        //         leftCircle = 15;
        //     } else if (i < 24) {
        //         topCircle = topCircle - 94;
        //         leftCircle = 7.5;
        //     } else {
        //         return
        //     }
        //     circleList.push({ topCircle: topCircle, leftCircle: leftCircle });
        // }
        // this.setData({
        //     circleList: circleList
        // })

        // //圆点闪烁
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
        var dir = 13;
        var topAward = dir;
        var leftAward = dir;
        for (var j = 0; j < 8; j++) {
            if (j == 0) {
                topAward = dir;
                leftAward = dir;
            } else if (j < 3) {
                topAward = topAward;
                //166.6666是宽.15是间距.下同
                leftAward = leftAward + 210 + dir;
            } else if (j < 5) {
                leftAward = leftAward;
                //150是高,15是间距,下同
                topAward = topAward + 210 + dir;
            } else if (j < 7) {
                leftAward = leftAward - 210 - dir;
                topAward = topAward;
            } else if (j < 8) {
                leftAward = leftAward;
                topAward = topAward - 210 - dir;
            }
            var imageAward = this.data.imageAward[j];
            awardList.push({ topAward: topAward, leftAward: leftAward, imageAward: imageAward });
             // awardList.push({ imageAward: imageAward });
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
                let num = that.data.activitylist.memberCount - 1;
                that.setData({
                    'activitylist.memberCount':num
                })
                let data = res.data.data;
                if (Number(data.isAward)) {
                    const result = {};
                    result.awardName = data.awardName;
                    result.awardId = data.awardId;

                    that.data.imageAward.forEach(function(item, index) {
                        if (item.id == result.awardId && item.name == result.awardName) {
                            that.setData({
                                resultIndex: index
                            })
                        }
                    })

                } else {
                    that.setData({
                        resultIndex: 7
                    })
                }

                fn && fn(Number(data.isAward));
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
        this.getResult(function(isAward){

        
        
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
                        const award = that.data.awardList[that.data.resultIndex];
                        let title = '恭喜您中奖';
                        let contentpre = '奖品：';
                        if (!isAward) {
                            title='很遗憾';
                            contentpre='';
                        }
                        wx.showModal({
                            title: title,
                            content: contentpre + award.imageAward.name,
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
    },
    onShareAppMessage: function() {
        let that = this;
        return {
            title:'我正在抽奖抽奖',
            url:'/pages/draw/detail/detail?id='+that.data.activitylist.id+'&userId='+that.data.userId,
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
})