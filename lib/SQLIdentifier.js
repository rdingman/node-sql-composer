var util = require('util');
var SQLObject = require('./SQLObject');

function SQLIdentifier(name) {
    SQLObject.call(this);

    this.name = name;
}

util.inherits(SQLIdentifier, SQLObject);

SQLIdentifier.prototype.toQuery = function () {
    return { sql: this.name, values : [] };
};

module.exports = SQLIdentifier;
