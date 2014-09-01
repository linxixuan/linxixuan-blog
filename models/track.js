var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var trackSchema = new Schema({
    time: String, 
    info: String,
    type: String,
    name: String,
},{
    collection: 'track'
});

trackModel = mongoose.model('Track', trackSchema);

function Track(track) {
    this.time = track.time;
    this.info = track.info;
    this.type = track.type;
    this.name = track.name;
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
        name: this.name,
    };

    var instance = new trackModel(track);
    instance.save(function () {
        callback();
    });
};

module.exports = Track;
