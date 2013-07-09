var util = require('util');
var assert = require('assert');
var Statement = require('./Statement');
var Column = require('./Column');
var Table = require('./Table');
var SortDescriptor = require('./SortDescriptor');
var Predicate = require('../predicates/Predicate');
var sql = require('../');

function InsertStatement() {
    Statement.call(this);
}

util.inherits(InsertStatement, Statement);

InsertStatement.prototype.into = function (table) {
    this.table = table;
    return this;
};

InsertStatement.prototype.values = function (values) {
    this.values = values;
    return this;
};

InsertStatement.prototype.toQuery = function () {
    assert(this.table.length > 0, 'An insert statement must specify a table.');
    assert(Object.keys(this.values).length > 0, 'An insert statement must insert at least one value.');

    var values = [];
    var sqlFragments = [ 'insert into', this.table ];

    var columnNames = [];
    var sqlValues = [];

    for (var key in this.values) {
        columnNames.push(sql.identifier(key));
        sqlValues.push(this.values[key]);
    }

    var query = columnNames.toQuery();
    sqlFragments.push(util.format('(%s)', query.sql));
    values = values.concat(query.values);

    sqlFragments.push('values');
    query = sqlValues.toQuery();
    sqlFragments.push(util.format('(%s)', query.sql));
    values = values.concat(query.values);

    return { sql: sqlFragments.join(' '), values: values };
};

module.exports = InsertStatement;

