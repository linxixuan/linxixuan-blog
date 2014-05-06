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
        data.blogs = [
            {
                'title': 'hello world',
                'content': 'hello! world!',
                'time': '04.03',
                'year': '2014',
                'tags': ['hello', 'world']
            },
            {
                'title': 'hello world',
                'content': 'hello! world!',
                'time': '04.03',
                'year': '2014',
                'tags': ['hello', 'world']
            }    
        ];
        res.render('index', data);
    });

    // 归档
    app.get('/history', function (req, res) {
        var data = commonData;
        Blog.get({}, function () {
            console.log(arguments);
        });
        res.render('history', data);
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
