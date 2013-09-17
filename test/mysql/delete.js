
var sql = require('../../lib');

exports.insert = {
    "Basic delete" : function (test) {
        var statement = sql.delete('table1');

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'delete from table1');
        test.deepEqual(query.values, [ ]);
        
        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'delete from table1');
        test.deepEqual(query.values, [ ]);
        
        test.done();
    },
    
    "delete with where clause" : function (test) {
        var statement = sql.delete('table1').where({ 'col1' : 'abc', col2: 123, col3: 'efg' });

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'delete from table1 where col1 = ? and col2 = 123 and col3 = ?');
        test.deepEqual(query.values, [ 'abc', 'efg' ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'delete from table1 where col1 = $1 and col2 = 123 and col3 = $2');
        test.deepEqual(query.values, [ 'abc', 'efg' ]);

        test.done();
    }
};

