var util = require('util');
var SQLObject = require('./SQLObject');

function SQLValue(value) {
    SQLObject.call(this);

    this.value = value;
}

util.inherits(SQLValue, SQLObject);

SQLValue.prototype.toQuery = function () {
/*
    var sql = null;
    var values = 
    if (Array.isArray(this.value) {
        var placeholders = this.value.map(function () { return '?'; });
        sql = util.format('%s in (%s)', this.key, placeholders.join(', '));
        values = this.value;
    }
*/
    return { sql : '?', values : [ this.value ] };
};

module.exports = SQLValue;
