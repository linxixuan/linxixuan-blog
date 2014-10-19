var https = require('https'),
    Track = require('../models/track'),
    crypto = require('crypto'),
    Weixin = require('../helper/WeixinHelper.js'),
    Music = require('../models/music'),
    mongoose = require('mongoose'),
    path = require('path');

var commonData;
Music = mongoose.model('Music');

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
            result;

        console.log(data);
        switch(Weixin.getType(data)) {
        case 'image':
            result = Weixin.getMsg('这是一个图片信息');
            break;
        default:
            result = Weixin.handleText(data);
            break;
        }

        res.send(result);
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

    // 音乐库
    app.get('/music', function (req, res) {
        var dir = path.resolve(__dirname, '..'),
            data = commonData,
            count = 10,
            id;
        Music.find({url: {$ne: ""}}).exec(function (err, musicArr) {
            musicArr = musicArr.slice(0, count);
            id = musicArr[0].douban_id;
            url = musicArr[0].url;

            https.get('https://api.douban.com/v2/music/' + id, function (d) {
                var info = '';
                d.on('data', function (data) {
                    info += data.toString();
                }).on('end', function () {
                    var music = {};
                    info = JSON.parse(info);

                    music.src = info.image.replace(/spic/, 'lpic');
                    music.title = musicArr[0].title;
                    music.name = [];
                    for(var p in info.author) {
                        music.name.push(info.author[p].name); 
                    }
                    music.name = music.name.join('/');
                    music.track = info.alt_title;
                    music.description = info.summary;
                    music.url = url;

                    data.music = music;
                    data.title = '悦|乐——林夕轩';
                    data.musicArr = musicArr;

                    res.render('music.ejs', data);
                });
            });

        });
    });
    
    // 获取音乐信息
    app.get('/getMusicInfo', function (req, res) {
        var id = req.param('id');

        https.get('https://api.douban.com/v2/music/' + id, function (data) {
            var info = "";
            data.on('data', function (data) {
                info += data.toString();
            }).on('end', function () {
                res.set("Content-Type", "application/json");
                res.send(JSON.stringify(info));
            });
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
