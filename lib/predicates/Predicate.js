var util = require('util');
var SQLObject = require('../SQLObject');
var SQLIdentifier = require('../SQLIdentifier');
var SQLValue = require('../SQLValue');

function Predicate() {
    SQLObject.call(this);
}

util.inherits(Predicate, SQLObject);

Predicate.parse = function (options, identifiers) {
    var predicates = [];

    if (Array.isArray(options)) {
        options.forEach(function (option) {
            var predicate = Predicate.parse(option, identifiers);
            predicates.push(predicate);
        });

        return new AndPredicate(predicates);
    } else {
        for (var key in options) {
            var value = options[key];

            if (!options.hasOwnProperty(key)) {
                continue;
            }

            var predicate = null;

            if (key == 'and') {
                predicate = Predicate.parse(value, identifiers); 
            } else if (key == 'or') {
                var OrPredicate = require('./OrPredicate');
            } else {
                var ComparisonPredicate = require('./ComparisonPredicate');

                var comparator = value.sql_comparator;

                if (!comparator) {
                    if (Array.isArray(value)) {
                        comparator = 'in';
                    } else {
                        comparator = '=';
                    }
                } else {
                    value = value.value;
                }

                if (!(key instanceof SQLObject)) {
                    key = new SQLIdentifier(key);
                }

                if (!(value instanceof SQLObject)) {
                    if (typeof(identifiers) == 'undefined') {
                        identifiers = false;
                    }

                    if (identifiers) {
                        value = new SQLIdentifier(value);
                    }
                }

                predicate = new ComparisonPredicate(key, comparator, value);
            }

            predicates.push(predicate);
        }

        var AndPredicate = require('./AndPredicate');
        return new AndPredicate(predicates);
    }
};

module.exports = Predicate;
