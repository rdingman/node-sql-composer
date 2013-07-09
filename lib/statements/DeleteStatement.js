var util = require('util');
var assert = require('assert');
var Statement = require('./Statement');
var Table = require('./Table');
var Predicate = require('../predicates/Predicate');
var sql = require('../');

function DeleteStatement(table) {
    Statement.call(this);

    this.table = table;
    this.predicates = [];
}

util.inherits(DeleteStatement, Statement);

DeleteStatement.prototype.where = function (options) {
    this.predicates.push(Predicate.parse(options));
    return this;
};

DeleteStatement.prototype.toQuery = function () {
    assert(this.table.length > 0, 'A delete statement must specify a table.');

    var values = [];
    var sqlFragments = [ 'delete from', this.table ];

    if (this.predicates.length > 0) {
        sqlFragments.push('where');
        var predicateFragments = [];
        this.predicates.forEach(function (predicate) {
            var query = predicate.toQuery();
            predicateFragments.push(query.sql);
            values = values.concat(query.values);
        });
        sqlFragments.push(predicateFragments.join(' and '));
    }

    return { sql: sqlFragments.join(' '), values: values };
};

module.exports = DeleteStatement;

