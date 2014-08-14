var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    account: String,
    password: String,
},{
    collection: 'user'
});

userModel = mongoose.model('User', userSchema);

function User(user) {
    this.account = blog.account;
    this.password = blog.password;
}

User.get = function (config, callback) {
    userModel.find(config).sort({date: -1}).exec(function (err, users) {
        if (err) {
            return callback(err);
        }
        callback(users);
    });
}

module.exports = User;
