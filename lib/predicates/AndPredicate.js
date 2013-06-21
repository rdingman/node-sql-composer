var util = require('util');
var Predicate = require('./Predicate');
var OrPredicate = require('./OrPredicate');

function AndPredicate(predicates) {
    Predicate.call(this);

    this.predicates = predicates;
}

util.inherits(AndPredicate, Predicate);

AndPredicate.prototype.toQuery = function () {
    var fragments = [];
    var values = [];

    this.predicates.forEach(function (predicate) {
        var query = predicate.toQuery();
        var sql = query.sql;
       
        if ((predicate instanceof OrPredicate) || (predicate instanceof AndPredicate)) {
            sql = util.format('(%s)', query.sql);
        }

        fragments.push(sql);
        values = values.concat(query.values);
    });

    sql = util.format('%s', fragments.join(' and '));
    return { sql: sql, values: values };
};

module.exports = AndPredicate;
