var util = require('util');
var assert = require('assert');
var Statement = require('./Statement');
var Column = require('./Column');
var Table = require('./Table');
var SortDescriptor = require('./SortDescriptor');
var Predicate = require('../predicates/Predicate');
var AndPredicate = require('../predicates/AndPredicate');
var sql = require('../');

function UpdateStatement(table) {
    Statement.call(this);

    this.table = table;
    this.predicates = [];
}

util.inherits(UpdateStatement, Statement);

UpdateStatement.prototype.set = function (values) {
    this.values = values;
    return this;
};

UpdateStatement.prototype.where = function (options) {
    this.predicates = this.predicates.concat(Predicate.parse(options));
    return this;
};

UpdateStatement.prototype.toQuery = function () {
    assert(this.table.length > 0, 'An update statement must specify a table.');
    assert(Object.keys(this.values).length > 0, 'An update statement must update at least one value.');

    var values = [];
    var sqlFragments = [ 'update', this.table, 'set' ];

    var columnNames = [];
    var sqlValues = [];

    for (var key in this.values) {
        if (!this.values.hasOwnProperty(key)) {
            continue;
        }

        var value = this.values[key];
        var valueSQL = null;

        if (value) {
            var valueQuery = value.toQuery();
            valueSql = valueQuery.sql;
            values = values.concat(valueQuery.values); 
        } else {
            valueSql = 'null';
        }

        sqlValues.push(util.format('%s = %s', key, valueSql));
    }

    sqlFragments.push(sqlValues.join(', '));

    if (this.predicates.length > 0) {
        sqlFragments.push('where');
        var whereQuery = new AndPredicate(this.predicates).toQuery();
        sqlFragments.push(whereQuery.sql);
        values = values.concat(whereQuery.values);
    }

    sql = sqlFragments.join(' ');
    return { sql: sql, values: values };
};

module.exports = UpdateStatement;

