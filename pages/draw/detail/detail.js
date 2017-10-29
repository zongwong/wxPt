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
        resultIndex:2,
        isRunning: false, //是否正在抽奖
        activitylist:null,
        imageAward: [{
                image: '../../../images/draw/1.png',
                name: "TV KING7S"
            },
            {
                image: '../../../images/draw/2.png',
                name: "PPBOX 小黑"
            },
            {
                image: '../../../images/draw/3.png',
                name: "PPTV 一年会员"
            },
            {
                image: '../../../images/draw/4.png',
                name: "家电券 100元"
            },
            {
                image: '../../../images/draw/5.png',
                name: "速度与激情T恤"
            },
            {
                image: '../../../images/draw/6.png',
                name: "乐高玩具"
            },
            {
                image: '../../../images/draw/7.png',
                name: "侏罗纪T恤"
            },
            {
                image: '../../../images/draw/8.png',
                name: "IPHONE6S 16G"
            }
        ], //奖品图片数组
        recordsList: [{
            id: "1",
            tel: "177*****443",
            goodName: "铠甲镀晶"
        }],
        actId:'',
        userId:14
    },
    onLoad: function(options) {
        let that = this;
        app.tokenCheck(function(){
            let actId = options.id;
            that.setData({
                userId:options.userId,
                actId:actId
            })
            that.getInfo(actId);
            that.loadDrawGame();
        })
    },
    goToMyAward: function(event) {
        wx.redirectTo({
            url: '../mine/mine',
        })
    },
    getInfo:function(actId){
        let that = this;
       utils.ajax('GET', 'api/cj/cjActivityMember/info', {
            actId: actId,
            userId:that.data.userId
        }, function(res) {
            if (res.data.code == 0) {
                that.setData({
                    activitylist:res.data.data
                })
            }
        });
    },
    onPullDownRefresh: function() {

    },
    onReachBottom: function() {

    },
    onShareAppMessage: function() {

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
        setInterval(function () {
          if (_this.data.colorCircleFirst == '#FFDF2F') {
            _this.setData({
              colorCircleFirst: '#FE4D32',
              colorCircleSecond: '#FFDF2F',
            })
          } else {
            _this.setData({
              colorCircleFirst: '#FFDF2F',
              colorCircleSecond: '#FE4D32',
            })
          }
        }, 500)//设置圆点闪烁的效果

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
    getResult:function(){
        let that = this;
        utils.ajax('POST', 'api/cj/cjAwardDetail/save', {
            actId: that.data.actId,
            userId:that.data.userId
        }, function(res) {
            if (res.data.code == 0) {
                that.setData({
                    resultIndex:2
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
        this.getResult();
        let that = this;
        var indexSelect = that.data.indexSelect;
        var start = that.data.indexSelect;
        var i = 0;
        // var randomMaxCount = Math.floor(Math.random() * 1000);

        var timer = setInterval(function() {
            indexSelect+=1;
            //这里我只是简单粗暴用y=30*x+200函数做的处理.可根据自己的需求改变转盘速度
            i += 30;
            console.log(indexSelect)
            if (indexSelect >= (8*3+start)) {
                //去除循环
                
                let dir = that.data.resultIndex - (that.data.indexSelect);
                dir = dir >= 0?dir:(8-Math.abs(dir));
                console.log(dir,that.data.resultIndex,that.data.indexSelect)
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
                                    // indexSelect: 0
                                })
                            }
                        }
                    })
                }else{
                    let ii = (that.data.indexSelect + 1) % 8;
                    // console.log(ii)
                    that.setData({
                        indexSelect: ii
                    })
                }
            }else{

                let aa = indexSelect % 8;
                that.setData({
                    indexSelect: aa
                })
            }
        }, (200 + i))
    }
})