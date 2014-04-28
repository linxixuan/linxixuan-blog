/**
 * 工具类
 */
function UtilHelper () {
}

module.exports = UtilHelper;

UtilHelper.initFEResource = function(FEs) {
    var res = '';
    for (var i = 0, len = FEs.length; i < len; i++) {
        res +=
        '<div class="people">' +
        '   <h3 class="people__name">' + FEs[i] + '</h3>' +
        '   <div class="people__days">';
        for(var j = 0, l = dates.length; j < l; j++) {
            res +=
            '<div class="day">' +
            '   <div class="day__title"></div>' +
            '   <div class="day__am"></div>' +
            '   <div class="day__pm"></div>' +
            '</div>';
        }
        res +=
        '   </div>' +
        '</div>';
    }

    return res;
}
