var util = require('util');
var assert = require('assert');
var Statement = require('./Statement');
var Table = require('./Table');
var Predicate = require('../predicates/Predicate');
var AndPredicate = require('../predicates/AndPredicate');
var sql = require('../');

function DeleteStatement(table) {
    Statement.call(this);

    this.table = table;
    this.predicates = [];
}

util.inherits(DeleteStatement, Statement);

DeleteStatement.prototype.where = function (options) {
    var predicates = Predicate.parse(options);
    var self = this;
    predicates.forEach(function (predicate) {
        predicate.parent = self;
    });
    this.predicates = this.predicates.concat(predicates);
    return this;
};

DeleteStatement.prototype.toQuery = function () {
    assert(this.table.length > 0, 'A delete statement must specify a table.');

    var values = [];
    var sqlFragments = [ 'delete from', this.table ];

    if (this.predicates.length > 0) {
        sqlFragments.push('where');
        var andPredicate = new AndPredicate(this.predicates);
        andPredicate.parent = this;
        var whereQuery = andPredicate.toQuery();
        sqlFragments.push(whereQuery.sql);
        values = values.concat(whereQuery.values);
    }

    return { sql: sqlFragments.join(' '), values: values };
};

module.exports = DeleteStatement;

