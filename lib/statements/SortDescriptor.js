var util = require('util');
var SQLObject = require('../SQLObject');
var assert = require('assert');

function SortDescriptor(name, order) {
    SQLObject.call(this);

    this.name = name;

    if (order) {
        assert(order == 'asc' || order == 'desc');
    }

    this.order = order;
}

util.inherits(SortDescriptor, SQLObject);

SortDescriptor.parse = function (options) {
    var descriptors = [];

    if (Array.isArray(options)) {
        options.forEach(function (option) {
            descriptors.push(new SortDescriptor(option));
        });
    } else {
        for (var name in options) {
            if (!options.hasOwnProperty(name)) {
                continue;
            }

            var order = options[name];
            descriptors.push(new SortDescriptor(name, order));
        }
    }

    return descriptors;
};

SortDescriptor.prototype.toSQL = function () {
    if (this.order) {
        return util.format('%s %s', this.name, this.order);
    } else {
        return this.name;
    }
};

module.exports = SortDescriptor;
