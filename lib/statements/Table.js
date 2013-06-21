var util = require('util');
var SQLObject = require('../SQLObject');

function Table(name, alias) {
    SQLObject.call(this);

    this.name = name;
    this.alias = alias;
}

util.inherits(Table, SQLObject);

Table.prototype.toSQL = function () {
    var fragments = [ this.name ];

    if (this.alias) {
//        fragments.push('as');
        fragments.push(this.alias);
    }

    return fragments.join(' ');
};

module.exports = Table;
