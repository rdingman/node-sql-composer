
var sql = require('../lib');

exports.functions = {
    "simple function" : function (test) {
        var func = sql.func('sha2', sql.func('concat', sql.identifier('salt'), 'abc'), 256);

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = func.toQuery();
        test.equal(query.sql, 'sha2(concat(salt, ?), 256)');
        test.deepEqual(query.values, [ 'abc' ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = func.toQuery();
        test.equal(query.sql, 'sha2(concat(salt, $1), 256)');
        test.deepEqual(query.values, [ 'abc' ]);

        test.done();
    }
};


