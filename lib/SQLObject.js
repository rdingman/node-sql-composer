var util = require('util');

function SQLObject() {
    Object.call(this);
    this.parent = null;
    this.parameterCounter = 0;
}

util.inherits(SQLObject, Object);

SQLObject.prototype.toQuery = function () {
};

Object.defineProperty(SQLObject.prototype, "rootObject", {
    enumerable : false,
    configurable : false,
    getter : function() {
        var rootObject = this;
        while (rootObject.parent) {
            rootObject = rootObject.parent;
        }
        
        return rootObject;
    }
});

Object.defineProperty(SQLObject.prototype, "nextParameterIndex", {
    enumerable : false,
    configurable : false,
    get: function() {
        return ++this.parameterCounter;
    }
});

module.exports = SQLObject;
