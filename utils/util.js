const app = getApp();

const formatTime = date => {
    date = new Date(date);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 从一个数组中随机取出若干个元素组成数组
 * @param {Array} arr 原数组
 * @param {Number} count 需要随机取得个数
 **/
const getRandomArray = (arr, count) => {
    var shuffled = arr.slice(0),
        i = arr.length,
        min = i - count,
        temp,
        index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

const phoneCallFn = (telNum) => {
    wx.makePhoneCall({
        phoneNumber: telNum,
        success: function() {
            console.log("拨打电话成功！")
        },
        fail: function() {
            console.log("拨打电话失败！")
        }
    })
}

/**
 * 从一个数组中随机取出一个元素
 * @param {Array} arr 原数组
 **/
const getRandomArrayElement = arr => {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ajax请求
function ajax(type = 'get', url = "", data = {}, success, fail) {
    const mydata = wx.getStorageSync('mydata');
    let header = {
        'authorization': mydata.token,
    };
    if (type == 'post' || type == 'POST') {
        header['content-type'] = 'application/x-www-form-urlencoded';
    }
    if(url.slice(0,4)!="http"){
        url = 'https://www.baby25.cn/jeesite/' + url;
    }
    wx.request({
        method: type,
        url: url,
        data: data,
        header: header,
        success: function(res) {
            success(res);
        },
        fail: function(res) {
            fail(res);
        }
    })
}

// 图片错误
function errImgFun(e, that ,attrName = "imgUrl",imgUrl="../../images/default_rect.png") {
    let errImg = e.target.dataset.errImg;
    let errObj = {};
    errObj['' + errImg + '.'+attrName] = imgUrl;

    that.setData(errObj);
}
//展示二维码
function qrcodeShow(e){
    let qrcodeUrl = e.target.dataset['qrcode'];
    wx.previewImage({
        urls: [qrcodeUrl]
    })
}
module.exports = {
    ajax: ajax,
    formatTime: formatTime,
    errImgFun: errImgFun,
    qrcodeShow:qrcodeShow,
    getRandomArray: getRandomArray,
    getRandomArrayElement: getRandomArrayElement,
    phoneCallFn: phoneCallFn
}