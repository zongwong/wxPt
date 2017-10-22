Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrolltop: null, //滚动位置
    showModalStatus: false,
    liwuIcon: '../../../images/user/liwu.png',
    detailInfo: {
      imgUrl: "http://bryanly.oss-cn-shenzhen.aliyuncs.com/itembg.png",
      price: Math.floor(Math.random() * 10) + '元博',
      title: "￥4455元铠甲镀晶",
      peple: Math.floor(Math.random() * 1000) + '人参与'
    },
    awards: [
      {
        id: "1",
        telNum: "177*****332",
        goodName: "铠甲镀晶"
      },
      {
        id: "2",
        telNum: "177*****332",
        goodName: "我也不知道"
      },
    ],
    allSelects: [
      {
        id: "1",
        title: "您驾驶的汽车属于",
        items: [
          {
            id: "1",
            name: "公车",
            checked: false
          }, {
            id: "2",
            name: "私车",
            checked: false
          }
        ]
      }, {
        id: "2",
        title: "镀晶可以保护车身",
        items: [
          {
            id: "1",
            name: "可以",
            checked: false
          }, {
            id: "2",
            name: "步行",
            checked: false
          }
        ]
      }
    ],
    unckeckImg: '../../../images/user/unchecked.png',
    ckeckImg: '../../../images/user/checked.png',
    needToPay: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchPurchaseData();
  },
  fetchPurchaseData: function () {  //获取会议室列表

  },
  lookMyAward: function (event) {
    wx.redirectTo({
      url: '../mine/mine',
    })
  },
  changeState: function (event) {
    var dataset = event.currentTarget.dataset;
    var checked = dataset['check'] ? false : true;
    var id = dataset['id'];
    var parentId = dataset['parentid'];
    console.log(checked)
    console.log(id)
    console.log(parentId)
    this.setData({
      allSelects: this.setCurrentSelectChecked(parentId, checked, id)
    })
  },
  setCurrentSelectChecked: function (parentId, checked, id) {
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
            // break;
          } else {
            cellItem.checked = !checked;
          }
        }
      }
    }
    return _allSelects;
  },
  submit: function (event) {
    wx.redirectTo({
      url: '',
    })
  },
  setStatusClass: function (e) { //设置状态颜色
    console.log(e);
  },
  scrollHandle: function (e) { //滚动事件
    this.setData({
      scrolltop: e.detail.scrollTop
    })
  },
  goToTop: function () { //回到顶部
    this.setData({
      scrolltop: 0
    })
  },
  scrollLoading: function () { //滚动加载
    this.fetchPurchaseData();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 0,
      activitylist: []
    })
    this.fetchPurchaseData();
    this.fetchSortData();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
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
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
        wx.redirectTo({
          url: '../award/award',
        })
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  }

})