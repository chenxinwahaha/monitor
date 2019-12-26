const defaultColors = ['#3d84a8', '#f08a5d', '#b83b5e', '#6a2c70', '#00b8a9', '#fccf4d']

export function getRandomColor(index,colors = defaultColors) {
  return colors[index % colors.length]
}


//十六进制颜色值域RGB格式颜色值之间的相互转换

//-------------------------------------
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function () {
  var that = this;
  var aColor = that.split(",");
  var strHex = "#";
  for (var i = 0; i < aColor.length; i++) {
    var hex = Number(aColor[i]).toString(16);
    if (hex === "0") {
      hex += hex;
    }
    strHex += hex;
  }
  if (strHex.length !== 7) {
    strHex = that;
  }
  return strHex;
};

//-------------------------------------------------

/*16进制颜色转为RGB格式*/
String.prototype.colorRgb = function () {
  var sColor = this.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = "#";
      for (var i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    var sColorChange = [];
    for (var i = 1; i < 7; i += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
    }
    return sColorChange.join(",");
  } else {
    return sColor;
  }
};
