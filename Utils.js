/**
 * Utility functions
 */
var sprintf = require("sprintf-js").sprintf;

class Utils {
    static simpleDateTime(date) {
        return  sprintf('%02d/%02d/%04d %02d:%02d', date.getMonth()+1, date.getDate(), date.getFullYear(),
            date.getHours(), date.getMinutes());
    }
}

module.exports = Utils;
