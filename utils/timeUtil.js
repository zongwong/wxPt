//time_val 比对的时间 格式如2016-12-14 22:55:40
function countDown(time_val) {
  var www_qsyz_net = /^[\d]{4}-[\d]{1,2}-[\d]{1,2}( [\d]{1,2}:[\d]{1,2}(:[\d]{1,2})?)?$/ig, str = '', s;
  if (!time_val.match(www_qsyz_net)) {
    alert('参数格式为2012-01-01[ 01:01[:01]].\r其中[]内的内容可省略');
    return false;
  }
  var sec = (new Date(time_val.replace(/-/ig, '/')).getTime() - new Date().getTime()) / 1000;
  if (!(sec > 0)) {
    sec *= -1;
  }
  s = { '天': sec / 24 / 3600, '小时': sec / 3600 % 24, '分': sec / 60 % 60, '秒': sec % 60 };
  for (var i in s) {
    if (Math.floor(s[i]) > 0) {
      if (i == '天') {
        str += Math.floor(s[i]) + "天 ";
      } else {
        if (Math.floor(s[i]) < 10) {
          str += '0' + Math.floor(s[i]) + ":";
        } else {
          str += Math.floor(s[i]) + ":";
        }
      }
    }
  }
  if (Math.floor(sec) == 0) { str = '00'; }
  var len = str.length;
  str = str.substring(0, len - 1);
  // console.log(str)
  //每隔一秒更新
  // setTimeout(function () { countDown(time_val) }, 1000);
  return str;
}

module.exports = {
  countDown: countDown
}