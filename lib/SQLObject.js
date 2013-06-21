var util = require('util');

function SQLObject() {
    Object.call(this);
}

util.inherits(SQLObject, Object);

SQLObject.prototype.toSQL = function () {
};

module.exports = SQLObject;
