var Track = require('../models/track'),
    crypto = require('crypto'),
    path = require('path');

var commonData;

module.exports = function(app){
    commonData = {
        title: '林夕轩',
        avatar: '/images/sp-head.jpg',
    };
    // animation ppt
    app.get('/animation', function (req, res) {
        var data = {};
        res.render('animation', data);
    });

    // 获取追踪数据
    app.get('/track', function(req, res) {
        Track.get({}, function (tracks) {
            var data = commonData,
                timeStamp,
                personalInfo = {},
                type,
                rawData;
            
            // 分类统计信息
            for (var i = 0, len = tracks.length; i < len; i++) {
                type = tracks[i].type;
                if (!personalInfo[type]) {
                    personalInfo[type] = {
                        time: [],
                        datasets: []
                    }
                }

                /**
                 * 时间处理
                 */
                timeStamp = new Date(tracks[i].time * 1000);
                if (type === 'weight') {
                    personalInfo[type].time.push(timeStamp.getFullYear() + '/' + (timeStamp.getMonth() + 1) + '/' + timeStamp.getDate() + ' ' + timeStamp.getHours() + ':' + timeStamp.getMinutes());
                } else {
                    personalInfo[type].time.push(timeStamp.getFullYear() + '/' + (timeStamp.getMonth() + 1) + '/' + timeStamp.getDate());
                }

                rawData = tracks[i].info.split('-');
                for (var j = 0; j < rawData.length; j++) {
                    if (!personalInfo[type].datasets[j]) {
                        personalInfo[type].datasets[j] = [];
                    }
                    personalInfo[type].datasets[j].push(rawData[j]);
                }
            }
            console.log(personalInfo);
            data.personalInfo = personalInfo;
            res.render('track', data);
        });
    });

    app.get('/weixin', function (req,res) {
        if (check(req)) {
            res.send(req.query.echostr);
        };

        function check(req) {
            var signature = req.query.signature,
            timestamp = req.query.timestamp,
            nonce = req.query.nonce,
            TOKEN = 'wazml';

            var shasum = crypto.createHash('sha1');

            tmpArr = [TOKEN, timestamp, nonce];
            tmpArr.sort();
            tmpStr = tmpArr.join('');
            shasum.update(tmpStr);
            tmpStr =  shasum.digest('hex');

            if( tmpStr == signature ){
                return true;
            }else{
                return false;
            }
        }
    });

    app.post('/weixin', function(req, res) {
        var data = req.body.xml,
            content = data.content[0].split('-'),
            type = content.shift(),
            info = content.join('-');

        var msgTpl = '<xml><ToUserName>' + data.fromusername[0] + '</ToUserName><FromUserName>' + data.tousername[0]+ '</FromUserName><CreateTime>' + (+new Date() / 1000).toFixed(0) + '</CreateTime><MsgType>text</MsgType><Content>{content}</Content></xml>';

        if (data.fromusername.indexOf('oZtA5t1cwg6kooV2X_Hvvxko2t6A') >= 0) {
            if (content.length > 0) {
                var RUN = 'r',
                    WEIGHT = 'w',
                    PUSH = 'p';
            
                switch(type) {
                case RUN:
                    type = 'run';
                    break;
                case WEIGHT:
                    type = 'weight';
                    break;
                default:
                    type = 'push';
                }

                track = new Track({
                    info: info,
                    time: data.createtime[0],
                    type: type,
                    name: 'linxixuan',
                });
                
                track.save(function () {
                    res.send(msgTpl.replace(/\{content\}/, '保存成功'));
                });
            } else {
                res.send(msgTpl.replace(/\{content\}/, '数据格式错误'));
            }
        } else {
            res.send(msgTpl.replace(/\{content\}/, '你不是我的主人~呱'));
        }
    });

    app.get('/tb', function (req, res) {
        var params = req.query,
            group = req.query.group,
            time = req.query.time;

        if (group !== '' && time !== '') {
            // 页面渲染需要设定投票结束
            //res.render('tbresult.ejs', commonData);
        } else {
            res.render('tb.ejs', commonData);
        }
    });

    app.post('/tb', function (req, res) {
        var tb = new TeamBuilding(req.body),
            group = req.body.group,
            time = req.body.time;
        tb.save(function () {
            res.redirect('/tb/?group=' + group + '&time=' + time);
        });
    });

    // 机器人文档
    app.get('/robots.txt', function (req, res) {
        var dir = path.resolve(__dirname, '..');
        fs.readFile(dir + '/webroot/robots.txt', function (err, data) {
            data += '';
            res.set('Content-Type', 'text/plain');
            res.send(data);
        });
    });

    // 关于我
    app.get('/about', function (req, res) {
        var data = commonData;
        res.render('about', data);
    });

    // 404
    app.use(function(req, res, next) {
        res.status(404);

        res.render('404', commonData);
    });
};
