/*
 * GET home page.
 */
var Blog = require('../models/blog'),
    User = require('../models/user'),
    TeamBuilding = require('../models/teambuilding'),
    hljs = require('highlight.js'),
    fs = require('fs'),
    js2xml = require('obj2xml'),
    path = require('path'),
    imgSize = require('image-size'),
    crypto = require('crypto'),
    marked = require('marked');

var commonData;

var highlight = function(code, lang){
    var o;

    if(lang == 'js') {
        lang = 'javascript';
    } else if (lang == 'html') {
        lang = 'xml';
    }

    if(lang){
        o = hljs.highlight(lang, code);
    } else {
        o = hljs.highlightAuto(code).value;
    }
    var html = o.value;
    if(html){
        return html;
    } else {
        return code;
    }
};
marked.setOptions({
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    langPrefix: '',
    highlight: highlight
});

module.exports = function(app){

    commonData = {
        title: '林夕轩',
        avatar: '/images/sp-head.jpg',
    };

    // 博客展示页面
    app.get('/blog', function (req, res) {
        var data = commonData,
            bname = req.query.bname;
        Blog.get({bid: bname}, function (blog) {
            if (blog[0]) {
                blog = blog[0];
                blog.day = blog.date.getFullYear() + '-' + (blog.date.getMonth() + 1) + '-' + blog.date.getDate();
                content = blog.content.replace(/\\n/g, '\n');
                blog.content = marked(content);
                data.blog = blog;
                res.render('blog/default', data);
            } else {
                res.redirect('/');
            }
        });
    });

    // 博客预览
    app.post('/preview', function (req, res) {
        var content = req.body.content;
        content = content.replace(/\\n/g, '\n');
        content = marked(content);

        res.json(200, {title: req.body.title, content: content});
    });

    // 提交博客
    app.post('/blog', function (req, res) {
        var blogReq = req.body,
            isUpdate = req.body.method === 'update',
            blog;

        blogReq.date = new Date();
        blog = new Blog(blogReq);
        if (!isUpdate) {
            blog.save(function () {
            });
        } else {
            Blog.update({bid: blog.bid}, blog);
        }
        res.redirect('/');
    });

    app.get('/blog/edit', function (req, res) {
        var data = commonData,
            bname = req.query.bname;
        if (req.cookies.uid) {
            if (bname) {
                Blog.get({bid: bname}, function (blog) {
                    data.blog = blog[0];
                    res.render('blog/edit', data);
                });
            } else {
                data.blog = null;
                res.render('blog/edit', data);
            }
        } else {
            res.redirect('../../login?bname=' + req.query.bname);
        }
    });

    // animation ppt
    app.get('/animation', function (req, res) {
        var data = {};
        res.render('animation', data);
    });

    app.get('/', function (req, res) {
        var data = commonData;
        Blog.get({}, function (blogs) {
            // 对日期进行处理
            for(var index in blogs) {
                var date = blogs[index].date;
                blogs[index].day = (date.getMonth() + 1) + '-' + date.getDate();
                blogs[index].year = date.getFullYear();
            }
            data.blogs = blogs;
            res.render('index', data);
        });
    });

    // 关于我
    app.get('/about', function (req, res) {
        var data = commonData;
        res.render('about', data);
    });

    // 登录页
    app.get('/login', function (req, res) {
        var data = commonData;

        data.bname = req.query.bname;
        res.render('login', data);
    });

    // 提交登录
    app.post('/login', function (req, res) {
        var account = req.body.account,
            psw = req.body.password,
            isUser = false,
            bname = req.body.bname;
        User.get({}, function(users) {
            for (var i = 0, len = users.length; i < len; i++) {
                if (account === users[i].account && psw === users[i].password) {
                    isUser = true;
                    break;
                }
            }
            if (isUser) {
                res.cookie('uid', account, {maxAge: 900000});
                if (bname) {
                    res.redirect('../blog/edit?bname=' + bname);
                } else {
                    res.redirect('../blog/edit');
                }
            } else {
                res.render('login', commonData);
            }
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

    // 获取指定条件的博客
    app.get('/history', function (req, res) {
        var query = req.query,
            value,
            blogs = [],
            config = {},
            beginDate,
            endDate,
            data = commonData,
            isAjax = req.xhr;

        if (Object.keys(query).length > 1) {
            res.redirect('/');
        }

        // 搜索标签
        if (query.hasOwnProperty('tag')) {
            value = query['tag'];
            config = {tags: {$in: [value]}};
        }

        if (query.hasOwnProperty('date')) {
            value = query['date'];
            beginDate = new Date(value.split('-')[0]);
            if (value.indexOf('-') === -1) {
                endDate = new Date(beginDate.getTime() + 24 * 60 * 60 * 1000);
            } else {
                endDate = new Date(value.split('-')[1]);
            }
            config = {date: {$lt: endDate, $gte: beginDate}};
        }

        Blog.get(config, function (blogs) {
            var tagList = [],
                dateList = [];
            // 对日期进行处理
            for(var index in blogs) {
                var date = blogs[index].date,
                    tags = blogs[index].tags,
                    year = date.getFullYear(),
                    month = date.getMonth(),
                    day = date.getDate();
                for (var i = 0, len = tags.length; i < len; i++) {
                    if (tagList.indexOf(tags[i]) === -1) {
                        tagList.push(tags[i]);
                    }
                }
                if (dateList.indexOf(year + '/' + (month + 1) + '/' + day) === -1) {
                    dateList.push(year + '/' + (month + 1) + '/' + day);
                }
                blogs[index].day = (month + 1) + '-' + day;
                blogs[index].year = year;
            }
            data.blogs = blogs;
            data.tagList = tagList;
            data.dateList = dateList;

            if (!isAjax) {
                res.render('history', data);
            }
        });
    });

    // 图库
    app.get('/pic', function (req, res) {
        var data = commonData,
            galleryPath = 'public/gallery',
            foldPaths,
            picPaths,
            firstPic,
            foldList = [],
            picList = [];
        if (!req.query.fold) {
            foldPaths = fs.readdirSync(galleryPath);
            for (var i = 0,len = foldPaths.length; i < len; i++) {
                if (foldPaths[i] !== '.DS_Store') {
                    if (fs.readdirSync(galleryPath + '/' + foldPaths[i])[0] === '.DS_Store') {
                        firstPic = fs.readdirSync(galleryPath + '/' + foldPaths[i])[1];
                    } else {
                        firstPic = fs.readdirSync(galleryPath + '/' + foldPaths[i])[0];
                    }
                    firstPic = 'gallery/' +  foldPaths[i] + '/' + firstPic;
                    foldList.push({
                        'name': foldPaths[i],
                        'firstPic': firstPic,
                    });
                }
            }
        } else {
            var fold = req.query.fold,
                dimension;
            picPaths = fs.readdirSync(galleryPath + '/' + fold);
            for (var i = 0,len = picPaths.length; i < len; i++) {
                if (picPaths[i] !== '.DS_Store') {
                    dimension = imgSize('public/gallery/' + fold + '/' + picPaths[i]);

                    picList.push({
                        'name': picPaths[i].replace(/\.\S+/g, ''),
                        'imgSrc': 'gallery/' + fold + '/' + picPaths[i],
                        'width': dimension.width,
                        'height': dimension.height
                    });
                }
            }
        }

        // 渲染数据填充
        data.foldList = foldList;
        data.picList = picList;
        res.render('pic', data);
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
            type = data.msgtype,
            msgObj = {};

        if (type.indexOf('text') >= 0) {
            msgObj = {
                ToUserName: '![CDATA[' + data.touser + ']]',
                FromUserName: '![CDATA[' + data.fromuser + ']]',
                CreateTime: data.createtime,
                MsgType: '![CDATA[' + data.msgtype + ']]',
                Content: '![CDATA[hello]]'
            };
        }

        conosle.log(msgObj);
        response.set('Content-Type', 'text/xml');
        response.send(js2xml.convert(msgObj));
    });
    // 404
    app.use(function(req, res, next) {
        res.status(404);

        res.render('404', commonData);
    });
};
