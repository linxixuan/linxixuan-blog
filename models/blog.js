var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/zmx');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    bid: String,
    title: String,
    summary: String,
    content: String,
    tags: Array,
    date: {type: Date}
},{
    collection: 'blog'
});
    
blogModel = mongoose.model('Blog', blogSchema);
