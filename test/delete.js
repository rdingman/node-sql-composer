
var sql = require('../lib');

exports.insert = {
    "Basic delete" : function (test) {
        var statement = sql.delete('table1');
        var query = statement.toQuery();
        test.equal(query.sql, 'delete from table1');
        test.deepEqual(query.values, [ ]);
        test.done();
    },
    "delete with where clause" : function (test) {
        var statement = sql.delete('table1').where({ 'col1' : 'abc' });
        var query = statement.toQuery();
        test.equal(query.sql, 'delete from table1 where col1 = ?');
        test.deepEqual(query.values, [ 'abc' ]);
        test.done();
    }
};

