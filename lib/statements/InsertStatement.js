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
    this.returningColumns = [];
    return this;
};

InsertStatement.prototype.values = function (values) {
    var self = this;
    
    for (var key in values) {
        var value = values[key];
        
        if (typeof(value) === 'string') {
            value = new String(value);
        }
        
        if (value !== null && value !== undefined) {
            value.parent = this;
        }

        values[key] = value;
    }
    
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
        
        var value = this.values[key];
        
        if (typeof(value) == 'string') {
            value = new String(value);
        }
        sqlValues.push(value);
    }

    var query = columnNames.toQuery();
    sqlFragments.push(util.format('(%s)', query.sql));
    values = values.concat(query.values);

    sqlFragments.push('values');
    query = sqlValues.toQuery();
    sqlFragments.push(util.format('(%s)', query.sql));
    values = values.concat(query.values);
    
    if (this.returningColumns.length) {
        sqlFragments.push('returning')
        var columnSQL = [];
        this.returningColumns.forEach(function (column) {
            columnSQL.push(column.toSQL());
        });

        sqlFragments.push(columnSQL.join(', '));
    }
    

    return { sql: sqlFragments.join(' '), values: values };
};

InsertStatement.prototype.returning = function(options) {
    var columns = Column.parse(options);
    var self = this;
    columns.forEach(function (column) {
        column.parent = self;
    });
    
    this.returningColumns = this.returningColumns.concat(columns);
    return this;
}
module.exports = InsertStatement;

