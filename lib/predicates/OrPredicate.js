var util = require('util');
var Predicate = require('./Predicate');

function OrPredicate(predicates) {
    Predicate.call(this);

    this.predicates = predicates;
}

util.inherits(OrPredicate, Predicate);

OrPredicate.prototype.toQuery = function () {
    var fragments = [];
    var values = [];

    var length = this.predicates.length;
    
    this.predicates.forEach(function (predicate) {
        var query = predicate.toQuery();
        var sql = query.sql;
       
        var AndPredicate = require('./AndPredicate');
        if ((predicate instanceof OrPredicate) || (predicate instanceof AndPredicate)) {
            if (length > 1) {
                sql = util.format('(%s)', query.sql);
            } else {
                sql = util.format('%s', query.sql);
            }
        }

        fragments.push(sql);
        values = values.concat(query.values);
    });

    sql = util.format('%s', fragments.join(' or '));
    return { sql: sql, values: values };
};

module.exports = OrPredicate;
