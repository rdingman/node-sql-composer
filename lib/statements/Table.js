var util = require('util');
var SQLObject = require('../SQLObject');

function Table(name, alias) {
    SQLObject.call(this);

    this.name = name;
    this.alias = alias;
}

util.inherits(Table, SQLObject);

Table.prototype.toQuery = function () {
    var fragments = [];
    var values = [];

    if (typeof(this.name) === 'string') {
        fragments.push(this.name);
    } else {
        var query = this.name.toQuery();
        fragments.push(util.format('(%s)', query.sql));
        values = values.concat(query.values);
    }

    if (this.alias) {
//        fragments.push('as');
        fragments.push(this.alias);
    }

    return { sql: fragments.join(' '), values: values };
};

module.exports = Table;
