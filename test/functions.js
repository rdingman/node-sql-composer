
var sql = require('../lib');

exports.functions = {
    "simple function" : function (test) {
        // sha2(concat(u.salt, ?), 256)
        var func = sql.func('sha2', sql.func('concat', sql.identifier('salt'), 'abc'), 256);
        var query = func.toQuery();
        test.equal(query.sql, 'sha2(concat(salt, ?), 256)');
        test.deepEqual(query.values, [ 'abc' ]);
        test.done();
    }
};


