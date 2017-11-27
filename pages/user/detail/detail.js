import utils from "../../../utils/util.js";
import timeUtil from "../../../utils/timeUtil.js";
const app = getApp();
Page({
    data: {
        payStatus: 0,
        showModalStatus: false,
        liwuIcon: '../../../images/user/liwu.png',
        awards: [],
        allSelects: [],
        unckeckImg: '../../../images/user/unchecked.png',
        ckeckImg: '../../../images/user/checked.png',
        needToPay: 5,
        isMyself: true,
        activityInfo: '',
        isAjax: false,
        carNum: '',
        mobile: '',
        vcode: '',
        orderId: '',
        isDjs: false,
        djsText: '获取验证码',
        userId: '',
        originId: '',
        isHelped: false,
        originName: '',
        ableTime: 0,
        isPayed: false,
        isChai: false,
        isHead: false,
        isFront: false,
        isHeadTop: false,
        fromShow: false,
        isRuning: false,
        myAwardInfo: {},
    },
    onLoad: function (options) {
        // originId区分我自己,payStatus区分支付,ableTime邀请次数,拆奖 记录本地openAward = orderId & true ,记录本地actId = orderId+actId
        // 1.我的入口, 我(未支付,信息展示, '无orderId' , )   我(已支付,未拆奖) 我(已支付,已拆奖[有无邀请次数])
        // 2.好友入口,已拆奖 / 未拆奖 
        // userId是必须的
        // 拆奖后-> 清理openAward
        let that = this;
        utils.userInfoCb(app);
        console.log(options)

        app.tokenCheck(function () {
            let userId = options.userId,
                originId = options.originId || app.globalData.memberId,
                orderId = options.orderId || '',
                originName = options.originName;
            that.setData({
                originId: originId,
                userId: userId,
                orderId: orderId,
                originName: originName,
            })


            if (originId == app.globalData.memberId) {
                //我自己
                that.setData({
                    isMyself: true,
                })

            } else {
                //好友
                that.setData({
                    isMyself: false,
                })

                try {
                    let chaiRecord = wx.getStorageSync('chaiRecord')
                    if (chaiRecord) {
                        //已帮忙拆奖
                        let record = chaiRecord.split('&');
                        if (record[0] == that.data.orderId && Boolean(record[1])) {
                            that.setData({
                                isHelped: true
                            })
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            }


            if (typeof options.userId !== 'undefined' && options.userId) {
                that.setData({
                    userId: options.userId
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '参数错误,请重新进入',
                    success: function () {
                        wx.navigateTo({
                            url: '/pages/user/user'
                        })
                    }
                })
                return false;
            }

            utils.ajax('GET', 'api/hx/hxActivity/info', {
                actId: options.id,
                orderId: that.data.orderId,
            }, function (res) {

                if (res.data.code == 0) {
                    let data = res.data.data;
                    that.setData({
                        activityInfo: data,
                        endTime: data.endTime,
                        payStatus: data.payStatus
                    });
                    if (typeof data.ableTime != 'undefined' && data.ableTime) {
                        that.setData({
                            ableTime: parseInt(data.ableTime)
                        })
                    }
                    // if (!parseFloat(that.data.activityInfo.money)) { //0元博
                    //     that.setData({
                    //         payStatus: 1
                    //     })
                    // } 
                    // 时间
                    // let endtime = timeUtil.countDown(that.data.endTime);

                    // if (!endtime) {
                    //     wx.showModal({
                    //         title: '提示',
                    //         content: '时间错误',
                    //         success: function(res) {
                    //             wx.navigateTo({
                    //                 url: '/pages/crowdfunding/crowdfunding'
                    //             })
                    //         }
                    //     })
                    // } else if (endtime === '活动已结束') {
                    //     wx.showModal({
                    //         title: '提示',
                    //         content: '来晚啦,活动已结束~',
                    //         success: function(res) {
                    //             wx.navigateTo({
                    //                 url: '/pages/crowdfunding/crowdfunding'
                    //             })
                    //         }
                    //     })
                    // } else {
                    //     setInterval(function() {
                    //         that.setData({
                    //             timeCountDown: timeUtil.countDown(that.data.endTime)
                    //         })
                    //     }, 1000);
                    // }

                    // 中奖记录手机号处理
                    if (typeof data.details != 'undefined') {
                        let awards = Array.from(data.details);

                        let awardsRecord = awards.filter(function (item, index) {
                            return (item.isAward == 1)
                        })
                        awardsRecord.forEach(function (item, index) {
                            let mobile;
                            if (typeof item.mobile != 'undefined') {
                                mobile = item.mobile;
                            }
                            if (typeof item.member != 'undefined') {
                                if (typeof item.member.mobile != 'undefined') {
                                    mobile = item.member.mobile;
                                }
                            }
                            if (mobile.length !== 11) {
                                mobile = '1' + [3, 5, 8, 7][Math.floor(Math.random() * 4)] + (Math.floor(Math.random() * 788899899 + 121254896));
                            }
                            item.mobile = mobile.substring(0, 3) + "****" + mobile.substring(7, 11);
                        })
                        that.setData({
                            awards: awardsRecord.slice(0, 1)
                        })
                        let start = 0;
                        if (awardsRecord.length >= 2) {

                            setInterval(function () {
                                start += 1;
                                if (start > awardsRecord.length - 1) {
                                    start = 0;
                                }
                                let nowList = awardsRecord.slice(start, start + 1)
                                that.setData({
                                    awards: nowList
                                })
                            }, 1500)
                        } else {
                            that.setData({
                                awards: awardsRecord
                            })
                        }
                    }
                    // 问卷题目处理

                    if (typeof data.topics != 'undefined') {
                        let topics = Array.from(data.topics);

                        topics.forEach(function (item, index) {

                            let options = item.option.split(';');
                            let selects = [];

                            options.forEach(function (option, index) {
                                selects.push({
                                    id: index + 1,
                                    name: option,
                                    checked: false
                                })
                            })
                            item.items = selects;
                        })
                        that.setData({
                            allSelects: topics
                        })

                    }
                }
            })
        })
    },
    onShow: function () {
        if (this.data.payStatus == 2) {
            //直接拆奖
            this.createAnimation('open');
        }
    },
    //跳转->我的奖品
    lookMyAward: function (event) {
        wx.redirectTo({
            url: '../mine/mine',
        })
    },
    //问卷作答
    changeState: function (event) {
        let dataset = event.currentTarget.dataset;
        let checked = dataset['check'] ? false : true;
        let parentIndex = dataset['parentindex'];
        let childIndex = dataset['childindex'];
        let parentId = dataset['parentid'];
        let type = dataset['type'];
        let that = this;
        if (type == 1) { //单选
            this.data.allSelects[parentIndex].items.forEach(function (item, index) {
                let str = 'allSelects[' + parentIndex + '].items[' + index + '].checked';
                if (item.id == (childIndex + 1)) {
                    that.setData({
                        [str]: checked
                    })
                } else {
                    that.setData({
                        [str]: false
                    })
                }
            })
        } else if (type == 2) { //多选
            let str = 'allSelects[' + parentIndex + '].items[' + childIndex + '].checked';
            this.setData({
                [str]: checked,
            })
        }
    },
    // 问卷提交
    wjSubmit: function (event) {
        if (this.data.orderId && !this.data.payStatus) {
            if (!parseFloat(this.data.activityInfo.money)) {
                this.createAnimation('open');
            } else {
                this.pay();
            }

            return false;
        }
        let that = this;
        let topocIds = '',
            answers = '';
        let isFirst = true;
        let count = 0;
        this.data.allSelects.forEach(function (item, index) {
            topocIds += item.id + ';';
            item.items.forEach(function (ans, ansi) {
                if (ans.checked) {
                    answers += ans.id + ',';
                    if (isFirst) {
                        count += 1;
                        isFirst = false;
                    }
                }
            })
            answers = answers.slice(0, answers.length - 1)
            answers += ';';
            isFirst = true;
        })

        if (answers === ';' || count < this.data.allSelects.length) {
            wx.showModal({
                title: '提示',
                content: '请回答所有问题再提交',
            })
            return false;
        }


        if (that.data.isAjax) {
            return false;
        }
        that.setData({
            isAjax: true
        })

        utils.ajax('POST', 'api/hx/hxTopic/finish', {
            topicIds: topocIds,
            answers: answers,
            userId: that.data.userId,
            actId: that.data.activityInfo.id,
            orderId: that.data.orderId,
        }, function (res) {
            that.setData({
                isAjax: true
            })
            if (res.data.code == 0) {
                //问卷提交成功
                let data = res.data.data;
                console.log(data)
                if (!that.data.orderId && that.data.isMyself) {
                    that.setData({
                        orderId: data.id,
                    })
                }
                if (!that.data.isMyself) {
                    //代抽
                    that.createAnimation('open');
                } else {
                    that.setData({
                        payStatus: data.payStatus
                    })
                    //支付
                    if (!parseFloat(that.data.activityInfo.money)) { //0元博
                        that.createAnimation('open');
                    } else {
                        that.pay()
                    }
                }

            }

        })
    },
    //获取微信支付参数
    pay: function () {
        let that = this;
        utils.ajax('POST', 'api/hx/hxOrder/pay', {
            actId: that.data.activityInfo.id,
            userId: that.data.userId,
            type: 1,
            openid: app.globalData.openid,
            orderId: that.data.orderId
        }, function (res) {
            if (res.data.code == 0) {
                that.wxPayment(res.data.data);
            }
        })
    },
    //微信支付
    wxPayment: function (Payment) {
        let that = this;
        wx.requestPayment({
            'timeStamp': '' + Payment.timeStamp,
            'nonceStr': Payment.nonceStr,
            'package': Payment.wxPackage,
            'signType': 'MD5',
            'paySign': Payment.sign,
            'success': function (res) {
                that.createAnimation('open');
                that.setData({
                    payStatus: 2
                })
            },
            'fail': function (res) {

            }
        })
    },
    //获取验证码
    getCode: function () {
        if (this.data.isDjs) {
            return false;
        }


        if (!(/^1[34578]\d{9}$/.test(this.data.mobile))) {
            wx.showModal({
                title: '提示',
                content: '手机格式不对,请重新输入'
            })
            return false;
        }
        let that = this;
        utils.ajax('POST', 'api/hx/hxAwardDetail/smsCode', {
            mobile: that.data.mobile,
            orderId: that.data.orderId
        }, function (res) {
            if (res.data.code == 0) {
                that.setData({
                    isDjs: true
                })
                let time = 10;
                let timer = setInterval(function () {
                    time -= 1;

                    that.setData({
                        djsText: time + 's后重新获取'
                    })
                    if (time == 0) {
                        clearInterval(timer);
                        that.setData({
                            djsText: '获取验证码',
                            isDjs: false
                        })
                    }
                }, 1000);
            }
        })
    },
    //表单绑定
    bindKeyInput: function (e) {
        let name = e.currentTarget.dataset['name'];
        this.setData({
            [name]: e.detail.value
        })
    },
    // 代抽
    replaceGet: function () {
        let that = this;
        that.setData({
          isRuning: true
        })
        console.log('代抽:' + that.data.orderId);
        utils.ajax('POST', 'api/hx/hxAwardDetail/replace', {
            orderId: that.data.orderId,
        }, function (res) {

            console.log(res)
            if (res.data.code == 0) {
                // 代抽成功
                wx.setStorageSync('chaiRecord', that.data.orderId + '&1');
                that.setData({
                    // isRuning: false,
                    isHelped: true
                })
                let data = res.data.data;
                if (+data.friendAward.isAward || +data.myAward.isAward) {
                    let query = {
                        originName: that.data.originName,
                        friendAward: data.friendAward.isAward,
                        friendAwardName: data.friendAward.awardName,
                        friendImgUrl: data.friendAward.imgUrl,
                        friendPrice: data.friendAward.price,
                        myAward: data.myAward.isAward,
                        myAwardName: data.myAward.awardName,
                        myImgUrl: data.myAward.imgUrl,
                        myPrice: data.myAward.price,
                    }
                    wx.redirectTo({
                        url: '/pages/user/replaceAward/replaceAward?query=' + JSON.stringify(query)
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '很遗憾,没有中奖,感谢您的参与',
                        complete: function (res) {
                            wx.navigateTo({
                                url: '/pages/user/user'
                            })
                        }
                    })
                }
            } else {
                wx.showModal({
                    title: '提示',
                    content: '接口出错,打开调试看下'
                })
            }

        }, function (res) {
            console.log(res);
        })
    },
    // 立即抽奖
    getReward: function (e) {
        let formId = e.detail.formId;
        if (+this.data.activityInfo.carCheck) {
            if (!this.data.carNum) {
                wx.showModal({
                    title: '提示',
                    content: '请输入车牌号'
                })
                return false;
            }
        }
        // 字段验证
        if (!(/^1[34578]\d{9}$/.test(this.data.mobile)) || !this.data.vcode) {
            wx.showModal({
                title: '提示',
                content: '请填写正确的手机号和验证码'
            })
            return false;
        }

        if (this.data.isRuning) {
            return false;
        }
        // 代抽
        if (this.data.orderId && !this.data.isMyself) {
            this.replaceGet();
            return false;
        }

        this.setData({
          isRuning: true
        })
        let that = this;

        utils.ajax('POST', 'api/hx/hxAwardDetail/openAward', {
            orderId: that.data.orderId,
            mobile: that.data.mobile,
            licensePlate: that.data.carNum || '',
            smsCode: that.data.vcode,
        }, function (res) {
            // that.setData({
            //     isRuning: false
            // })
            console.log(res)
            if (res.data.code == 0) {

                let data = res.data.data;
                that.setData({
                    ableTime: parseInt(data.ableTime),
                    payStatus: 3
                })


                if (+data.isAward) { //中奖

                    let query = {
                        awardName: data.awardName,
                        imgUrl: data.imgUrl,
                        price: data.price,
                        ableTime: data.ableTime,
                        orderId: that.data.orderId,
                        userId: that.data.userId,
                        originId: that.data.originId,
                        id: that.data.activityInfo.id
                    }
                    that.setData({
                        myAwardInfo: {
                            awardName: data.awardName,
                            price: data.price,
                        }
                    })

                    // that.sendResult(formId,function(){
                    wx.redirectTo({
                        url: '/pages/user/award/award?query=' + JSON.stringify(query)
                    })
                    // });

                } else {
                    wx.showModal({
                        title: '提示',
                        content: '很遗憾,没有中奖,感谢您的参与',
                        complete: function (res) {
                            that.createAnimation('close');
                            // wx.navigateTo({
                            //     url: '/pages/user/user'
                            // })
                        }
                    })
                }

            } else {
                wx.showModal({
                    title: '提示',
                    content: '系统错误'
                })
            }
        })
    },
    //弹窗
    powerDrawer: function (e) {
        var currentStatu = e.currentTarget.dataset.statu;
        this.createAnimation(currentStatu)
    },
    createAnimation: function (currentStatu, callback) {
        /* 动画部分 */
        // 第1步：创建动画实例   
        var animation = wx.createAnimation({
            duration: 200, //动画时长  
            timingFunction: "linear", //线性  
            delay: 0 //0则不延迟  
        });

        // 第2步：这个动画实例赋给当前的动画实例  
        this.animation = animation;

        // 第3步：执行第一组动画  .rotateX(-100)
        animation.opacity(0).step();

        // 第4步：导出动画对象赋给数据对象储存  
        this.setData({
            animationData: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画  
        setTimeout(function () {
            // 执行第二组动画  
            animation.opacity(1).step();
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
            this.setData({
                animationData: animation
            })

            //关闭  
            if (currentStatu == "close") {
                this.setData({
                    showModalStatus: false
                });
            }
        }.bind(this), 200)

        // 显示  
        if (currentStatu == "open") {
            this.setData({
                showModalStatus: true
            });
        }
    },
    chai: function () {
        let that = this;
        this.setData({
            isChai: true
        })
        setTimeout(function () {
            that.setData({
                isChai: false,
                isHeadTop: true,
            })
            setTimeout(function () {
                that.setData({
                    isFront: true,
                    fromShow: true,
                })
                setTimeout(function () {
                    that.setData({
                        isHead: true,
                    })
                }, 0);
            }, 900);
        }, 1000);
    },
    sendResult: function (formId, fn) {
        console.log('formId:' + formId)
        let that = this;
        utils.ajax('GET', 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + app.globalData.appid + '&secret=' + app.globalData.secret, {}, function (res) {
            console.log('access_token:' + res.data.access_token)
            let access_token = res.data.access_token;
            let query = {
                "touser": app.globalData.openid,
                "template_id": 'pKHQMIqlSHKII6vyx99Oi_b0RLgiI2KvZV2baAvXvgQ',
                "form_id": formId,
                "page": '/pages/user/mine/mine',
                "data": {
                    "keyword1": {
                        "value": '[' + that.data.activityInfo.money + '元博]' + that.data.activityInfo.name,
                    },
                    "keyword2": {
                        "value": that.data.myAwardInfo.awardName + '(价值:￥' + that.data.myAwardInfo.price + ')',
                        "color": "#6C4176"
                    },
                    "keyword3": {
                        "value": '众途各大门店',
                    },
                    "keyword4": {
                        "value": '10086',
                    }
                }
            };
            console.log(query)
            wx.request({
                url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + access_token,
                query,
                data: query,
                method: 'POST',
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    console.log('通知结果:')
                    console.log(res.data)
                    fn && fn();
                }
            })
            // utils.ajax('POST','https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+access_token,query,function(res){
            //     console.log('通知结果:')
            //     console.log(res)
            // })

        })


    },
    previewImg: function (e) {
        utils.qrcodeShow(e);
    },
    onShareAppMessage: function () {

        if (this.data.isMyself && this.data.orderId) {
            let myname = app.globalData.userInfo.nickName;
            let query = 'id=' + this.data.activityInfo.id + '&userId=' + this.data.userId + '&originId=' + this.data.originId + '&orderId=' + this.data.orderId + '&originName=' + myname;
            return {
                title: myname + '邀请您代抽奖品',
                path: '/pages/user/detail/detail?' + query,
                imageUrl: this.data.activityInfo.imgUrl,
                success: function (res) {
                    console.log('分享成功:' + query)
                },
                fail: function (res) {
                    // 转发失败
                }
            }
        } else {
            //默认分享

            let query = 'id=' + this.data.activityInfo.id + '&userId=' + this.data.userId + '&originId=';
            return {
                path: '/pages/user/detail/detail?' + query,
                imageUrl: this.data.activityInfo.imgUrl,
                success: function () {
                    console.log('默认:' + query)
                }
            }
        }
    },
})