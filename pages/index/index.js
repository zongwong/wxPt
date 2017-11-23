// pages/index/index.js
import utils from "../../utils/util.js";
const app = getApp();
Page({
  data: {
  
  },
  onLoad:function(){
    utils.userInfoCb(app);
  },
  onShareAppMessage: function () {
  
  }
})