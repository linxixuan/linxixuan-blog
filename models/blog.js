var crypto = require('crypto'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/zmx');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    title: String,
    name: String,
    content: String,
    date: {type: Date, default: Date.now},
    tags: Array
},{
    collection: 'blog'
});
    
blogModel = mongoose.model('Blog', blogSchema);

function Blog(blog) {
    this.title = blog.title;
    this.summary = blog.summary;
    this.content = blog.content;
    this.tags = this.tags;
    this.date = blog.date;
}

Blog.get = function (config, callback) {
    blogModel.find(config, function (err, blogs) {
        if (err) {
            return callback(err);
        }
        callback(blogs);
    });
}

module.exports = Blog;
