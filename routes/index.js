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

    app.get('/', function (req, res) {
        var data = commonData;
        Blog.get({}, function (blogs) {
            // 对日期进行处理
            for(var index in blogs) {
                var date = blogs[index].date;
                blogs[index].date = null;
                blogs[index].day = date.getMonth() + '-' + date.getDate();
                blogs[index].year = date.getFullYear();
            }
            data.blogs = blogs;
            res.render('index', data);
        });
    });

    // 归档
    app.get('/history', function (req, res) {
        var data = commonData;
        Blog.get({}, function () {
        });
        res.render('history', data);
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

    // FE资源管理
    app.get('/feresource', function (req, res) {
        var data = {},
            FEs = ['xiaoming', 'xiaohong'],
            dates = ['周一', '周二', '周三', '周四', '周五'];

        data.FEs = FEs;
        res.render('resource', data);
    });
};
