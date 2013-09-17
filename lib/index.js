// http://savage.net.au/SQL/sql-92.bnf
var SelectStatement = require('./statements/SelectStatement');
var InsertStatement = require('./statements/InsertStatement');
var UpdateStatement = require('./statements/UpdateStatement');
var DeleteStatement = require('./statements/DeleteStatement');
var UnionStatement = require('./statements/UnionStatement');
var Operator = require('./predicates/Operator');
var SQLFunction = require('./SQLFunction');
var SQLIdentifier = require('./SQLIdentifier');
var SQLValue = require('./SQLValue');
var util = require('util');

exports.PARAMETER_STYLE_UNINDEXED = 0;
exports.PARAMETER_STYLE_INDEXED = 1;
exports.parameterStyle = 0;

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

exports.union = function (statements) {
    return new UnionStatement(statements);
};

exports.operator = Operator;

exports.identifier = function(value) {
    return new SQLIdentifier(value);
};

exports.value = function(value) {
    return new SQLValue(value);
};

exports.func = function() {
    var args = [];
    var length = arguments.length;
    for (var index = 1; index < length; index++) {
        args.push(arguments[index]);
    }

    return new SQLFunction(arguments[0], args);
};

Object.defineProperty(String.prototype, "toQuery", {
    enumerable : false,
    configurable : false,
    value : function() {
        var sqlString = '?';

        if (exports.parameterStyle === exports.PARAMETER_STYLE_INDEXED) {
            sqlString = util.format('$%d', this.rootObject.nextParameterIndex);
        }

        return { sql : sqlString, values : [ this.valueOf() ] };
    }
});

Object.defineProperty(Number.prototype, "toQuery", {
    enumerable : false,
    configurable : false,
    value : function() {
        return { sql : this.valueOf(), values : [] };
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
        var sqlString = '?';

        if (exports.parameterStyle === exports.PARAMETER_STYLE_INDEXED) {
            sqlString = util.format('$%d', this.rootObject.nextParameterIndex);
        }

        return { sql : sqlString, values : [ this.valueOf() ] };
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

Object.defineProperty(Object.prototype, "className", {
    enumerable : false,
    configurable : false,
    value : function (transform) {
        if (this && this.constructor && this.constructor.toString) {
            var arr = this.constructor.toString().match(/function\s*(\w+)/);

            if (arr && arr.length == 2) {
                return arr[1];
            }
        }

        return undefined;
    }               
});              

var rootObject = function () {
    var rootObject = this;

    while (rootObject.parent) {
        rootObject = rootObject.parent;
    }
    
    return rootObject;
}

Object.defineProperty(String.prototype, "rootObject", {
    get : function() {
        return rootObject.call(this);
    }
});

Object.defineProperty(Number.prototype, "rootObject", {
    get : function() {
        return rootObject.call(this);
    }
});

Object.defineProperty(Boolean.prototype, "rootObject", {
    get : function() {
        return rootObject.call(this);
    }
});

Object.defineProperty(Date.prototype, "rootObject", {
    get : function() {
        return rootObject.call(this);
    }
});

Object.defineProperty(Array.prototype, "rootObject", {
    get : function() {
        return rootObject.call(this);
    }
});
