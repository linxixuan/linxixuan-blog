var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    account: String,
    password: String,
},{
    collection: 'user'
});

userModel = mongoose.model('User', userSchema);
