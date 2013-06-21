var util = require('util');
var SQLObject = require('./SQLObject');

function SortDescriptor(values) {
    SQLObject.call(this);
}

util.inherits(SortDescriptor, SQLObject);

module.exports = SortDescriptor;
