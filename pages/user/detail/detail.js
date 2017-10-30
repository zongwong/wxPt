const utils = require('../../../utils/util.js');
import timeUtil from "../../../utils/timeUtil.js";
const app = getApp();
Page({
    data: {
        scrolltop: null, //滚动位置
        showModalStatus: false,
        liwuIcon: '../../../images/user/liwu.png',
        awards: [],
        allSelects: [
            // {
            //     id: "1",
            //     type:1,
            //     title: "您驾驶的汽车属于",
            //     items: [{
            //         id: "1",
            //         name: "公车",
            //         checked: false
            //     }, {
            //         id: "2",
            //         name: "私车",
            //         checked: false
            //     }]
            // }, {
            //     id: "2",
            //     title: "镀晶可以保护车身",
            //     type:2,
            //     items: [{
            //         id: "1",
            //         name: "可以",
            //         checked: false
            //     }, {
            //         id: "2",
            //         name: "步行",
            //         checked: false
            //     }]
            // }
        ],
        unckeckImg: '../../../images/user/unchecked.png',
        ckeckImg: '../../../images/user/checked.png',
        needToPay: 5,
        userId: '',
        inviteId: '',
        originId: '',
        isMyself: true,
        activityInfo: '',
        isAjax: false,
        carNum: '',
        mobile: '',
        vcode: '',
        orderId: '',
        isDjs: false,
        djsText: '获取验证码'
    },
    onLoad: function(options) {


        app.tokenCheck(function() {})

        if (typeof options.userId !== 'undefined' && options.userId) {
            this.setData({
                userId: options.userId
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '参数错误,请重新进入',
                success: function() {
                    wx.switchTab({
                        url: '/pages/user/user'
                    })
                }
            })
            return false;
        }

        // if (typeof options.inviteId !== 'undefined' && options.inviteId) {
        //     this.setData({
        //         inviteId: options.inviteId
        //     })
        // }
        // if (typeof options.originId !== 'undefined' && options.originId) {
        //     this.setData({
        //         originId: options.originId,
        //     })
        //     //判断众筹单是不是自己发起的
        //     if (options.originId != app.globalData.memberId) {
        //         this.setData({
        //             isMyself: false
        //         })
        //     }
        // }


        let that = this;
        utils.ajax('GET', 'api/hx/hxActivity/info', {
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
                        //判断自己是否在列表
                        if (item.memberId == app.globalData.memberId) {
                            that.setData({
                                iInList: true
                            })
                        }
                    })
                    that.setData({
                        menbers: memberList,
                    })
                }
                // let endtime = timeUtil.countDown(that.data.endTime);

                // if (!endtime) {
                //     wx.showModal({
                //         title: '提示',
                //         content: '时间错误',
                //         success: function(res) {
                //             wx.switchTab({
                //                 url: '/pages/crowdfunding/crowdfunding'
                //             })
                //         }
                //     })
                // } else if (endtime === '活动已结束') {
                //     wx.showModal({
                //         title: '提示',
                //         content: '来晚啦,活动已结束~',
                //         success: function(res) {
                //             wx.switchTab({
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
                // let awards = Array.from(data.details);
                let awards = [{
                    mobile: '13599252007',
                    awardName: 'qweqweqwe',
                }, {
                    mobile: '15559152007',
                    awardName: '我二气温气温',
                }, {
                    mobile: '54584252007',
                    awardName: '他一天一天',
                }, {
                    mobile: '13585742007',
                    awardName: '646IQ哦为',
                }]
                that.setData({
                    awards: awards.slice(0, 2)
                })
                awards.forEach(function(item, index) {
                    let mobile = item.mobile;
                    if (mobile.length === 11) {
                        item.mobile = mobile.substring(0, 3) + "****" + mobile.substring(8, 11);
                    }
                })

                let start = 0;
                if (awards.length >= 3) {

                    setInterval(function() {
                        start += 1;
                        if (start > awards.length - 2) {
                            start = 0;
                        }
                        let nowList = awards.slice(start, start + 2)
                        that.setData({
                            awards: nowList
                        })
                    }, 1500)
                } else {
                    that.setData({
                        awards: awards
                    })
                }

                // 问卷题目处理


                let topics = Array.from(data.topics);
                // {
                //       id: "1",
                //       type:1,
                //       title: "您驾驶的汽车属于",
                //       items: [{
                //           id: "1",
                //           name: "公车",
                //           checked: false
                //       }, {
                //           id: "2",
                //           name: "私车",
                //           checked: false
                //       }]
                //   }
                topics.forEach(function(item, index) {

                    let options = item.option.split(';');
                    let selects = [];

                    options.forEach(function(option, index) {
                        selects.push({
                            id: index + 1,
                            name: option,
                            checked: false
                        })
                    })
                    item.items = selects;
                    // item.type = 2;
                })

                that.setData({
                    allSelects: topics
                })


            }
        })
    },
    //跳转->我的奖品
    lookMyAward: function(event) {
        wx.redirectTo({
            url: '../mine/mine',
        })
    },
    //问卷作答
    changeState: function(event) {
        let dataset = event.currentTarget.dataset;
        let checked = dataset['check'] ? false : true;
        let parentIndex = dataset['parentindex'];
        let childIndex = dataset['childindex'];
        let parentId = dataset['parentid'];
        let type = dataset['type'];
        let that = this;
        if (type == 1) { //单选
            this.data.allSelects[parentIndex].items.forEach(function(item, index) {
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
    setCurrentSelectChecked: function(parentId, checked, id) {
        var _allSelects = this.data.allSelects;
        for (var i = 0; i < _allSelects.length; i++) {
            var item = _allSelects[i];
            var pId = item.id;
            if (pId == parentId) {
                var cell = item['items'];
                for (var j = 0; j < cell.length; j++) {
                    var cellItem = cell[j];
                    var cId = cellItem.id;
                    if (cId == id) {
                        cellItem.checked = checked;
                    } else {
                        cellItem.checked = !checked;
                    }
                }
            }
        }
        return _allSelects;
    },
    // 问卷提交
    wjSubmit: function(event) {
        let that = this;
        let topocIds = '',
            answers = '';
        let isFirst = true;
        let count = 0;
        this.data.allSelects.forEach(function(item, index) {
            topocIds += item.id + ';';
            item.items.forEach(function(ans, ansi) {
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
        console.log(count);

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
        }, function(res) {
            that.setData({
                isAjax: true
            })

            //问卷提交成功->支付
            // that.pay()

        })
    },
    //获取微信支付参数
    pay: function() {
        let that = this;
        utils.ajax('POST', 'api/hx/hxOrder/pay', {
            actId: that.data.activityInfo.id,
            userId: that.data.userId,
            type: 1,
            openid: app.globalData.openid
        }, function(res) {
            if (res.data.code == 0) {
                that.wxPayment(res.data.data);
            }
        })
    },
    //微信支付
    wxPayment: function(Payment) {
        let that = this;
        wx.requestPayment({
            'timeStamp': '' + Payment.timeStamp,
            'nonceStr': Payment.nonceStr,
            'package': Payment.wxPackage,
            'signType': 'MD5',
            'paySign': Payment.sign,
            'success': function(res) {
                that.createAnimation('open');
            },
            'fail': function(res) {

            }
        })
    },
    //获取验证码
    getCode: function() {
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
            orderId: that.data.orderId || 8
        }, function(res) {
            if (res.data.code == 0) {
                that.setData({
                    isDjs: true
                })
                let time = 10;
                let timer = setInterval(function() {
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
    bindKeyInput: function(e) {
        let name = e.currentTarget.dataset['name'];
        this.setData({
            [name]: e.detail.value
        })
    },
    // 立即抽奖
    getReward: function() {

        // 字段验证
        if (!this.data.mobile || !this.data.mobile || !this.data.mobile) {
            wx.showModal({
                title: '提示',
                content: '内容不能为空'
            })
            return false;
        }

        let that = this;
        utils.ajax('POST', 'api/hx/hxAwardDetail/openAward', {
            orderId: that.data.orderId || 8,
            mobile: that.data.mobile,
            licensePlate: that.data.carNum,
            smsCode: that.data.vcode,
        }, function(res) {
            if (res.data.code == 0) {
                let data = res.data.data;
                if (data.isAward) { //中奖
                    wx.navigateTo({
                        url: '/pages/user/award/award?awardName=&img=&shareCount=&price='
                    })
                } else {

                }

            }



        })
    },
    //弹窗
    powerDrawer: function(e) {
        var currentStatu = e.currentTarget.dataset.statu;
        this.createAnimation(currentStatu)
    },
    createAnimation: function(currentStatu, callback) {
        /* 动画部分 */
        // 第1步：创建动画实例   
        var animation = wx.createAnimation({
            duration: 200, //动画时长  
            timingFunction: "linear", //线性  
            delay: 0 //0则不延迟  
        });

        // 第2步：这个动画实例赋给当前的动画实例  
        this.animation = animation;

        // 第3步：执行第一组动画  
        animation.opacity(0).rotateX(-100).step();

        // 第4步：导出动画对象赋给数据对象储存  
        this.setData({
            animationData: animation.export()
        })

        // 第5步：设置定时器到指定时候后，执行第二组动画  
        setTimeout(function() {
            // 执行第二组动画  
            animation.opacity(1).rotateX(0).step();
            // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
            this.setData({
                animationData: animation
            })

            //关闭  
            if (currentStatu == "close") {
                this.setData({
                    showModalStatus: false
                });
                wx.redirectTo({
                    url: '../award/award',
                })
            }
        }.bind(this), 200)

        // 显示  
        if (currentStatu == "open") {
            this.setData({
                showModalStatus: true
            });
        }
    },
    onShareAppMessage: function() {
      let query = '?id=&originId=&ordeId=&'
    },


})