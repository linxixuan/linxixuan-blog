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

    // 归档
    app.get('/history', function (req, res) {
        var data = commonData;
        Blog.get({}, function (blogs) {
            // 对日期进行处理
            for(var index in blogs) {
                var date = blogs[index].date;
                blogs[index].day = date.getMonth() + '-' + date.getDate();
                blogs[index].year = date.getFullYear();
            }
            data.blogs = blogs;
            res.render('history', data);
        });
    });

    // 博客展示页面
    app.get('/blog', function (req, res) {
        var data = commonData,
            bname = req.query.bname;

         marked.setOptions({
             gfm: true,
             tables: true,
             breaks: true,
             pedantic: false,
             sanitize: false,
             smartLists: true,
             langPrefix: '',
             highlight: function (code) {
                return hljs.highlightAuto(code).value;
             }
         });

        Blog.get({bid: bname}, function (blog) {
            if (blog[0]) {
                blog = blog[0];
                blog.day = blog.date.getFullYear() + '-' + blog.date.getMonth() + '-' + blog.date.getDate();
                blog.content = marked(blog.content);
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
                blogs[index].day = date.getMonth() + '-' + date.getDate();
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
};
