var util = require('util');
var Predicate = require('./Predicate');

function AndPredicate(predicates) {
    Predicate.call(this);

    this.predicates = predicates;
    
    var self = this;
    this.predicates.forEach(function (predicate) {
        predicate.parent = self;
    });
}

util.inherits(AndPredicate, Predicate);

AndPredicate.prototype.toQuery = function () {
    var fragments = [];
    var values = [];

    var length = this.predicates.length;
    
    this.predicates.forEach(function (predicate) {
        var query = predicate.toQuery();
        var sql = query.sql;
       
        var OrPredicate = require('./OrPredicate');
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

    sql = util.format('%s', fragments.join(' and '));
    return { sql: sql, values: values };
};

module.exports = AndPredicate;
