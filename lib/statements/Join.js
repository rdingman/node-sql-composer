var util = require('util');
var SQLObject = require('../SQLObject');

function Join(table, predicate, type) {
    SQLObject.call(this);

    this.table = table;
    this.predicate = predicate;
    this.type = type;
}

util.inherits(Join, SQLObject);

Join.types = [ 'left outer', 'right outer', 'full outer', 'inner' ];

Join.prototype.toQuery = function() {
    var predicateQuery = this.predicate.toQuery();
    var fragments = [];
    var values = [];

    if (this.type) {
        fragments.push(this.type);
    }

    fragments.push('join');
    
    var tableQuery = this.table.toQuery();
    fragments.push(tableQuery.sql);
    values = values.concat(tableQuery.values);
    
    fragments.push('on');
    fragments.push(predicateQuery.sql);
    values = values.concat(predicateQuery.values);

    sqlString = fragments.join(' ');
    return { sql : sqlString, values : values };
};

module.exports = Join;
