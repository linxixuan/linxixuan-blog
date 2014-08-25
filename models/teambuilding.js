var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tbSchema = new Schema({
    group: String,
    time: String,
    plans: String
},{
    collection: 'teambuilding'
});
    
tbModel = mongoose.model('TeamBuilding', tbSchema);

function TeamBuilding(tb) {
    this.group = tb.group;
    this.time = tb.time;
    this.plans = tb.plans;
};

TeamBuilding.prototype.save = function (callback) {
    var tb = {
        group: this.group,
        time: this.time,
        plans: this.plans,
    };

    var instance = new tbModel(tb);
    instance.save(function () {
        callback();
    });
};

TeamBuilding.get = function (config, callback) {
    tbModel.find(config).exec(function (err, tbs) {
        if (err) {
            return callback(err);
        }
        callback(tbs);
    });
};

module.exports = TeamBuilding;
