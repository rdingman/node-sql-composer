// http://savage.net.au/SQL/sql-92.bnf
var SelectStatement = require('./statements/SelectStatement');
var Operator = require('./predicates/Operator');
var SQLIdentifier = require('./SQLIdentifier');
var SQLValue = require('./SQLValue');

exports.select = function (options) {
    return new SelectStatement(options);
};

exports.operator = Operator;

exports.identifier = function(value) {
    return new SQLIdentifier(value);
};

exports.value = function(value) {
    return new SQLValue(value);
};

