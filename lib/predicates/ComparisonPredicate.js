var util = require('util');
var Predicate = require('./Predicate');

function ComparisonPredicate(key, comparator, value) {
    Predicate.call(this);

    this.key = key; 
    this.value = value;
    this.comparator = comparator;

    if (!this.comparator) {
        if (Array.isArray(this.value)) {
            this.comparator = 'in';
        } else {
            this.comparator = '=';
        }
    }
}

util.inherits(ComparisonPredicate, Predicate);

String.prototype.toQuery = function() {
    return { sql : '?', values : [ this.valueOf() ] };
};

Number.prototype.toQuery = function() {
    return { sql : '?', values : [ this.valueOf() ] };
};

Date.prototype.toQuery = function() {
    return { sql : '?', values : [ this ] };
};

Array.prototype.toQuery = function() {
    var values = [];
    var sqlFragments = this.map(function(value) {
        var query = value.toQuery();
        values = values.concat(query.values);
        return query.sql;
    });

    sql = sqlFragments.join(', ');
    return { sql: sql, values: values };
};

ComparisonPredicate.prototype.toQuery = function() {
    var sql = null;
    var values = [];

    var keyQuery = this.key.toQuery();
    values.concat(keyQuery.values);

    if (this.comparator == 'between') {
        sql = util.format('%s between ? and ?', keyQuery.sql);
        values.push(this.value[0]);
        values.push(this.value[1]);
    } else if (this.comparator == 'in') {
        var valueQuery = this.value.toQuery();
        sql = util.format('%s in (%s)', keyQuery.sql, valueQuery.sql);
        values = values.concat = valueQuery.values;
    } else {
        var valueQuery = this.value.toQuery();
        sql = [ keyQuery.sql, this.comparator, valueQuery.sql ].join(' ');
        values = values.concat(valueQuery.values);
    }

    return { sql: sql, values: values };
};

module.exports = ComparisonPredicate;
