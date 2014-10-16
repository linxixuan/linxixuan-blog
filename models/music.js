var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var musicSchema = new Schema({
    title: String,
    author: String,
    track: String,
    url: String,
    id: String
},{
    collection: 'music'
});

userModel = mongoose.model('Music', musicSchema);
