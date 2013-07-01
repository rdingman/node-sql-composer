
var sql = require('../lib');

exports.insert = {
    "Basic update" : function (test) {
        var statement = sql.update('table1').set({ 'col1' : 123, 'col2' : 'Some text', 'col3' : sql.identifier('abc'), 'col4' : true, 'col5' : null });
        var query = statement.toQuery();
        test.equal(query.sql, 'update table1 set col1 = ?, col2 = ?, col3 = abc, col4 = true, col5 = null');
        test.deepEqual(query.values, [ 123, 'Some text' ]);
        test.done();
    }
};
