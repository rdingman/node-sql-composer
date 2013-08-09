var util = require('util');
var SQLObject = require('../SQLObject');
var assert = require('assert');

function Operator() {
    SQLObject.call(this);
}

util.inherits(Operator, SQLObject);

Operator.in = function (value) {
//    assert(Array.isArray(array), 'The in predicate requires an array');
    return createSpecialObject({ value : value }, 'in');
};

Operator.between = function (value) {
    assert(Array.isArray(value), 'The between predicate requires an array');
    assert(value.length == 2, 'The between predicate requires two arguments');
    return createSpecialObject({ value: value }, 'between');
};

Operator.like = function (value) {
    return createSpecialObject({ value: value }, 'like');
};

Operator.eq = function (value) {
    return createSpecialObject({ value: value }, '=');
};

Operator.ne = function (value) {
    return createSpecialObject({ value: value }, '<>');
};

Operator.gt = function (value) {
    return createSpecialObject({ value: value }, '>');
};

Operator.geq = function (value) {
    return createSpecialObject({ value: value }, '>=');
};

Operator.lt = function (value) {
    return createSpecialObject({ value: value }, '<');
};

Operator.leq = function (value) {
    return createSpecialObject({ value: value }, '<=');
};

function createSpecialObject(object, tag) {
    var getter = function() {
        return tag;
    };
    Object.defineProperty(object, "sql_comparator", {
        configurable : false,
        enumerable   : true,
        writable     : false,
        value        : tag,
        setter       : null
    });

    return object;
}

module.exports = Operator;
