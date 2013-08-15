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

ComparisonPredicate.prototype.toQuery = function() {
    var sql = null;
    var values = [];

    var keyQuery = this.key.toQuery();
    values.concat(keyQuery.values);

    if (!this.value) {
        if (this.comparator == 'not') {
            sql = util.format('%s is not null', keyQuery.sql);
        } else {
            sql = util.format('%s is null', keyQuery.sql);
        }
        return { sql: sql, values: values };
    }

    var valueQuery = this.value.toQuery();

    if (this.comparator == 'between') {
        sql = util.format('%s between ? and ?', keyQuery.sql);
        values.push(this.value[0]);
        values.push(this.value[1]);
    } else if (this.comparator == 'in') {
        sql = util.format('%s in (%s)', keyQuery.sql, valueQuery.sql);
        values = values.concat = valueQuery.values;
    } else if (this.comparator == 'not in') {
        sql = util.format('%s not in (%s)', keyQuery.sql, valueQuery.sql);
        values = values.concat = valueQuery.values;
    } else {
        sql = [ keyQuery.sql, this.comparator, valueQuery.sql ].join(' ');
        values = values.concat(valueQuery.values);
    }

    return { sql: sql, values: values };
};

module.exports = ComparisonPredicate;
