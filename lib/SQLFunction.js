var util = require('util');
var SQLObject = require('./SQLObject');

function SQLFunction(name, arguments) {
    SQLObject.call(this);

    this.name = name;
    this.arguments = arguments;
    var self = this;
    this.arguments = arguments.map(function (argument) {
        if (typeof(argument) === 'string') {
            argument = new String(argument);
        }
        argument.parent = self;
        
        return argument;
    });
}

util.inherits(SQLFunction, SQLObject);

SQLFunction.prototype.toQuery = function () {
    var argumentsQuery = this.arguments.toQuery();
    
    var sqlString = util.format('%s(%s)', this.name, argumentsQuery.sql);
    return { sql: sqlString, values : argumentsQuery.values };
};

module.exports = SQLFunction;
