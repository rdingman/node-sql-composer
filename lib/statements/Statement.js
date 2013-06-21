var util = require('util');
var SQLObject = require('../SQLObject');

function Statement() {
    SQLObject.call(this);
}

util.inherits(Statement, SQLObject);

module.exports = Statement;
