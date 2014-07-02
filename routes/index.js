/*
 * GET home page.
 */
var Blog = require('../models/blog');

var commonData;

module.exports = function(app){

    commonData = {
        title: '林夕轩',
        avatar: '/images/sp-head.jpg'
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
        Blog.get({bid: bname}, function (blog) {
            if (blog[0]) {
                blog = blog[0];
                blog.day = blog.date.getFullYear() + '-' + blog.date.getMonth() + '-' + blog.date.getDate();
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
        var data = commonData;
        res.render('blog/edit', data);
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
};
