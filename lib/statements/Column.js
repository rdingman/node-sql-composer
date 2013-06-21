var util = require('util');
var SQLObject = require('../SQLObject');

function Column(name, alias, table) {
    SQLObject.call(this);

    this.name = name;
    this.alias = alias;
    this.table = table;
}

util.inherits(Column, SQLObject);

Column.parse = function(options) {
    var columns = [];

    if (Array.isArray(options)) {
        options.forEach(function (columnSpecifier) {
            var column = null;

            if (typeof(columnSpecifier) === 'object') {
                var name = Object.keys(columnSpecifier)[0];
                var alias = columnSpecifier[name];
                column = new Column(name, alias);
            } else if (typeof(columnSpecifier) === 'string') {
                column = new Column(columnSpecifier, null);
            } else {
                throw Error('Column specifier must be either an object or a string');
            }

            columns.push(column);
        });
    } else {
        for (var name in options) {
            if (!options.hasOwnProperty(name)) {
                continue;
            }

            var alias = options[name];
            var column = new Column(name, alias);
            columns.push(column);
        }
    }

    return columns;
};


Column.prototype.toSQL = function () {
    var fragments = [ this.name ];

    if (this.alias) {
        fragments.push('as');
        fragments.push(util.format('"%s"', this.alias));
    }

    return fragments.join(' ');
};

module.exports = Column;
