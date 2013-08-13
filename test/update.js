
var sql = require('../lib');

exports.insert = {
    "Basic update" : function (test) {
        var statement = sql.update('table1').set({ 'col1' : 123, 'col2' : 'Some text', 'col3' : sql.identifier('abc'), 'col4' : true, 'col5' : null });
        var query = statement.toQuery();
        test.equal(query.sql, 'update table1 set col1 = 123, col2 = ?, col3 = abc, col4 = true, col5 = null');
        test.deepEqual(query.values, [ 'Some text' ]);
        test.done();
    },

    "Update with where clause" : function (test) {
        var statement = sql.update('table1').set({ 'col1' : 123, 'col2' : 'Some text', 'col3' : sql.identifier('abc'), 'col4' : true, 'col5' : null }).where({ col1: 123, col2: '456'});
        var query = statement.toQuery();
        test.equal(query.sql, 'update table1 set col1 = 123, col2 = ?, col3 = abc, col4 = true, col5 = null where col1 = 123 and col2 = ?');
        test.deepEqual(query.values, [ 'Some text', '456' ]);
        test.done();
    }
};

