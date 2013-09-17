
var sql = require('../../lib');

exports.insert = {
    "Basic update" : function (test) {
        var statement = sql.update('table1').set({ 'col1' : 123, 'col2' : 'Some text', 'col3' : sql.identifier('abc'), 'col4' : true, 'col5' : null, 'col6': 'efg' });

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'update table1 set col1 = 123, col2 = ?, col3 = abc, col4 = true, col5 = null, col6 = ?');
        test.deepEqual(query.values, [ 'Some text', 'efg' ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'update table1 set col1 = 123, col2 = $1, col3 = abc, col4 = true, col5 = null, col6 = $2');
        test.deepEqual(query.values, [ 'Some text', 'efg' ]);

        test.done();
    },

    "Update with where clause" : function (test) {
        var statement = sql.update('table1').set({ 'col1' : 0, 'col2' : 'Some text', 'col3' : sql.identifier('abc'), 'col4' : true, 'col5' : null }).where({ col1: 123, col2: '456'});

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'update table1 set col1 = 0, col2 = ?, col3 = abc, col4 = true, col5 = null where col1 = 123 and col2 = ?');
        test.deepEqual(query.values, [ 'Some text', '456' ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'update table1 set col1 = 0, col2 = $1, col3 = abc, col4 = true, col5 = null where col1 = 123 and col2 = $2');
        test.deepEqual(query.values, [ 'Some text', '456' ]);

        test.done();
    }
};

