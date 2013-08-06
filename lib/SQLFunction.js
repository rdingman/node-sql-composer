var util = require('util');
var SQLObject = require('./SQLObject');

function SQLFunction(name, args) {
    SQLObject.call(this);

    this.name = name;
    this.arguments = args;
}

util.inherits(SQLFunction, SQLObject);

SQLFunction.prototype.toQuery = function () {
    var argumentsQuery = this.arguments.toQuery();
    
    var sqlString = util.format('%s(%s)', this.name, argumentsQuery.sql);
    return { sql: sqlString, values : argumentsQuery.values };
};

module.exports = SQLFunction;
