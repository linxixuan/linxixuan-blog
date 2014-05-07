var crypto = require('crypto'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/zmx');
var Schema = mongoose.Schema;

var blogSchema = new Schema({
    title: String,
    summary: String,
    content: String,
    tags: Array,
    date: {type: Date}
},{
    collection: 'blog'
});
    
blogModel = mongoose.model('Blog', blogSchema);

function Blog(blog) {
    this.title = blog.title;
    this.summary = blog.summary;
    this.content = blog.content;
    this.tags = blog.tags.split(',');
    this.date = blog.date;
}

Blog.prototype.save = function (callback) {
    var blog = {
        title: this.title,
        summary: this.summary,
        content: this.content,
        tags: this.tags,
        date: this.date
    };

    var instance = new blogModel(blog);
    instance.save();
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
