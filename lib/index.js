// http://savage.net.au/SQL/sql-92.bnf
var SelectStatement = require('./statements/SelectStatement');
var InsertStatement = require('./statements/InsertStatement');
var UpdateStatement = require('./statements/UpdateStatement');
var DeleteStatement = require('./statements/DeleteStatement');
var Operator = require('./predicates/Operator');
var SQLIdentifier = require('./SQLIdentifier');
var SQLValue = require('./SQLValue');

exports.select = function (options) {
    return new SelectStatement(options);
};

exports.insert = function (options) {
    return new InsertStatement(options);
};

exports.update = function (options) {
    return new UpdateStatement(options);
};

exports.delete = function (options) {
    return new DeleteStatement(options);
};

exports.operator = Operator;

exports.identifier = function(value) {
    return new SQLIdentifier(value);
};

exports.value = function(value) {
    return new SQLValue(value);
};

Object.defineProperty(String.prototype, "toQuery", {
    enumerable : false,
    configurable : false,
    value : function() {
        return { sql : '?', values : [ this.valueOf() ] };
    }
});

Object.defineProperty(Number.prototype, "toQuery", {
    enumerable : false,
    configurable : false,
    value : function() {
        return { sql : '?', values : [ this.valueOf() ] };
    }
});

Object.defineProperty(Boolean.prototype, "toQuery", {
    enumerable : false,
    configurable : false,
    value : function() {
        return { sql : this.valueOf(), values: [] };
    }
});

Object.defineProperty(Date.prototype, "toQuery", {
    enumerable : false,
    configurable : false,
    value : function() {
        return { sql : '?', values : [ this ] };
    }
});

Object.defineProperty(Array.prototype, "toQuery", {
    enumerable : false,
    configurable : false,
    value : function() {
        var values = [];
        var sqlFragments = this.map(function(value) {
            if (value === null || value === undefined) {
                return 'null';
            }
            var query = value.toQuery();
            values = values.concat(query.values);
            return query.sql;
        });

        sql = sqlFragments.join(', ');
        return { sql: sql, values: values };
    }
});

