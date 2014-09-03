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
                typeArr = [],
                timeStamp,
                len,
                datasets = {};
            
            // 分类统计信息
            for (var i = 0, len = tracks.length; i < len; i++) {
                if (typeArr.indexOf(tracks[i].type) === -1) {
                    typeArr.push(tracks[i].type);
                    datasets[tracks[i].type] = [];
                }

                /**
                 * 时间处理
                 */
                timeStamp = new Date(tracks[i].time * 1000);
                if (tracks[i].type === 'weight') {
                    tracks[i].time = timeStamp.getFullYear() + '/' + (timeStamp.getMonth() + 1) + '/' + timeStamp.getDate() + ' ' + timeStamp.getHours() + ':' + timeStamp.getMinutes();
                } else {
                    tracks[i].time = timeStamp.getFullYear() + '/' + (timeStamp.getMonth() + 1) + '/' + timeStamp.getDate();
                }

                // 保证某个时间点只有一个数据，且后面的数据要覆盖旧数据
                len = datasets[tracks[i].type].length;
                if (len >= 1 && datasets[tracks[i].type][len - 1].time === tracks[i].time) {
                    datasets[tracks[i].type].pop();
                }
                /**
                 * 数据处理
                 */
                if (tracks[i].type === 'run') {
                    var tmp = tracks[i].info.split('-');
                    tracks[i] = [];
                    tracks[1].push(tmp[0]); // 时间
                    tracks[0].push(tmp[1]); // 里程
                }
                datasets[tracks[i].type].push(tracks[i]);
            }
            
            data.datasets = datasets;
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

        if (type && data.fromusername.indexOf('oZtA5t1cwg6kooV2X_Hvvxko2t6A') >= 0) {
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
                msg = '<xml><ToUserName>' + data.fromusername[0] + '</ToUserName><FromUserName>' + data.tousername[0]+ '</FromUserName><CreateTime>' + (+new Date() / 1000).toFixed(0) + '</CreateTime><MsgType>text</MsgType><Content>' + content + ':数据已保存</Content></xml>';
                
                res.send(msg);
            });
        }

        msg = '<xml><ToUserName>' + data.fromusername[0] + '</ToUserName><FromUserName>' + data.tousername[0]+ '</FromUserName><CreateTime>' + (+new Date() / 1000).toFixed(0) + '</CreateTime><MsgType>text</MsgType><Content>主人，收到</Content></xml>';
        
        res.send(msg);
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
