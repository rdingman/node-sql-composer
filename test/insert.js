
var sql = require('../lib');

exports.insert = {
    "Basic insert" : function (test) {
        var statement = sql.insert().into('table1').values({ 'col1' : 123, 'col2' : 'Some text', 'col3' : sql.identifier('abc'), 'col4' : true, 'col5' : null, 'col6' : 0, col7: 'efg' });
        
        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'insert into table1 (col1, col2, col3, col4, col5, col6, col7) values (123, ?, abc, true, null, 0, ?)');
        test.deepEqual(query.values, [ 'Some text', 'efg' ]);


        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'insert into table1 (col1, col2, col3, col4, col5, col6, col7) values (123, $1, abc, true, null, 0, $2)');
        test.deepEqual(query.values, [ 'Some text', 'efg' ]);

        test.done();
    },

    "insert with postgres returning extension": function (test) {
        var statement = sql.insert().into('table1').values({ 'col1' : 123, 'col2' : 'Some text' }).returning([ 'id' ]);
        
        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'insert into table1 (col1, col2) values (123, ?) returning id');
        test.deepEqual(query.values, [ 'Some text' ]);


        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'insert into table1 (col1, col2) values (123, $1) returning id');
        test.deepEqual(query.values, [ 'Some text' ]);

        test.done();
    }
};

