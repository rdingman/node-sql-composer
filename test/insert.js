
var sql = require('../lib');

exports.insert = {
    "Basic insert" : function (test) {
        var statement = sql.insert().into('table1').values({ 'col1' : 123, 'col2' : 'Some text', 'col3' : sql.identifier('abc'),'col4' : true });
        var query = statement.toQuery();
        test.equal(query.sql, 'insert into table1 (col1, col2, col3, col4) values (?, ?, abc, true)');
        test.deepEqual(query.values, [ 123, 'Some text' ]);
        test.done();
    },

    "insert with subquery": function (test) {
        test.done();
    }
};

