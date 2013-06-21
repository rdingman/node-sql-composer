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

    this.predicates.forEach(function (predicate) {
        var query = predicate.toQuery();
        fragments.push(query.sql);
        values = values.concat(query.values);
    });

    sql = util.format('(%s)', fragments.join(' or '));
    return { sql: sql, values: values };
};

module.exports = OrPredicate;
