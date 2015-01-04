var User = require('../models/user'),
    mongoose = require('mongoose');

var commonData;
User = mongoose.model('User');

module.exports = function(app){
    commonData = {
        title: '林夕轩',
        avatar: '/images/sp-head.jpg',
    };
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
            bname = req.query.bname,
            isUser = false;
        User.find({}).exec(function(err, users) {
            for (var i = 0, len = users.length; i < len; i++) {
                if (account === users[i].account && psw === users[i].password) {
                    isUser = true;
                    break;
                }
            }
            if (isUser) {
                res.cookie('uid', account, {maxAge: 900000});
                res.redirect('../blog/edit' + (bname ? '?bname=' + bname : ''));
            } else {
                res.render('login', commonData);
            }
        });
    });
};
