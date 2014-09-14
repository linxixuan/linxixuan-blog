function Weixin(req) {
};

/**
 * 处理追踪数据
 * @param xml类型的object
 * @return String 处理结果
 */
Weixin.getType = function (xmlObj) {
};

/**
 * 处理追踪数据
 * @param xml类型的object
 * @return String 处理结果
 */
Weixin.dealTrack = function (xmlObj) {
};

/**
 * 处理分享的音乐
 * @param xml类型的object
 * @return String 处理结果
 */
Weixin.handleMusic = function (xmlObj) {
};

/**
 * 处理图片
 * @param xml类型的object
 * @return String 处理结果
 */
Weixin.handlePic = function (content) {
}

Weixin.sendMsg = function (content) {
        var msgTpl = '<xml><ToUserName>' + data.fromusername[0] + '</ToUserName><FromUserName>' + data.tousername[0]+ '</FromUserName><CreateTime>' + (+new Date() / 1000).toFixed(0) + '</CreateTime><MsgType>text</MsgType><Content>' + content + '</Content></xml>';
};

module.exports = Weixin;
