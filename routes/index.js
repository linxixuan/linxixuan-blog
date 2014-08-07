/*
 * GET home page.
 */
var Blog = require('../models/blog'),
    hljs = require('highlight.js'),
    fs = require('fs'),
    path = require('path'),
    marked = require('marked');

var commonData;

module.exports = function(app){

    commonData = {
        title: '林夕轩',
        avatar: '/images/sp-head.jpg',
    };

    // 博客展示页面
    app.get('/blog', function (req, res) {
        var data = commonData,
            bname = req.query.bname;

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

    // 提交博客
    app.post('/blog', function (req, res) {
        var blogReq = req.body,
            blog;

        blogReq.date = new Date();
        blog = new Blog(blogReq);

        blog.save();
        res.redirect('/');
    });

    app.get('/blog/edit', function (req, res) {
        var data = commonData,
            cookie;
        if(!req.header('Cookie')) res.redirect('../../login');
        cookie = req.header('Cookie').split('=')
        if (cookie.indexOf('uid') !== -1) {
            res.render('blog/edit', data);
        } else {
            res.redirect('../../login');
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
        res.render('login', data);
    });

    // 提交登录
    app.post('/login', function (req, res) {
        var account = req.body.account,
            psw = req.body.password;
        if (account === 'zmx6631356' && psw === '277475785') {
            res.cookie('uid', account + '*' + psw, {maxAge: 1800});
            res.render('blog/edit', commonData);
        } else {
            res.clearCookie('uid');
            res.render('login', commonData);
        }
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
            endDate = new Date(value.split('-')[1]);
            config = {date: {$lte: endDate, $gt: beginDate}};
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
                dateList.push(year + '年' + month + '月');
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
};
