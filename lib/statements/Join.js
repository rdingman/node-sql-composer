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
    var query = this.predicate.toQuery();
    var fragments = [];

    if (this.type) {
        fragments.push(this.type);
    }

    fragments.push('join');
    fragments.push(this.table.toSQL());
    fragments.push('on');
    fragments.push(query.sql);

    sql = fragments.join(' ');
    return { sql : sql, values : query.values };
};

module.exports = Join;
