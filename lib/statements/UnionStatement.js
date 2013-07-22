var util = require('util');
var assert = require('assert');
var Statement = require('./Statement');
var SelectStatement = require('./SelectStatement');
var sql = require('../');

function UnionStatement(statements) {
    Statement.call(this);

    this.statements = [];
    this.union(statements); 
}

util.inherits(UnionStatement, Statement);

UnionStatement.prototype.union = function (statements) {
    if (!Array.isArray(statements)) {
        statements = [ statements ];
    }

    var self = this;

    statements.forEach(function (statement) {
        assert((statement instanceof SelectStatement), 'You can only union select statements');
        self.statements.push(statement);
    });
};

UnionStatement.prototype.toQuery = function () {
    assert(this.statements.length > 0, 'A union must have at least one statement.');

    var values = [];
    var sqlFragments = [];

    this.statements.forEach(function (statement) {
        var query = statement.toQuery();
        sqlFragments.push(query.sql);
        values.push(query.values);
    });

    return { sql: sqlFragments.join(' union '), values: values };
};

module.exports = UnionStatement;

