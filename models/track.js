var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var trackSchema = new Schema({
    time: String, 
    info: String,
    type: String,
},{
    collection: 'track'
});

trackModel = mongoose.model('Track', trackSchema);

function Track(track) {
    this.time = blog.time;
    this.info = blog.info;
    this.type = blog.type;
}

Track.get = function (config, callback) {
    trackModel.find(config).exec(function (err, tracks) {
        if (err) {
            return callback(err);
        }
        callback(tracks);
    });
}

Track.prototype.save = function (callback) {
    var track = {
        info: this.info,
        time: this.time,
        type: this.type,
    };

    var instance = new trackModel(track);
    instance.save(function () {
        callback();
    });
};

module.exports = Track;
