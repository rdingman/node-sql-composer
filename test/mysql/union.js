
var sql = require('../../lib');

exports.select = {
    "Basic union" : function (test) {
        var statement1 = sql.select([ 't1.col1', 't1.col2', 't1.col3' ]).from({'table1' : 't1'}).where({ 't1.col1': 'abc' });
        var statement2 = sql.select([ 't2.col1', 't2.col2', 't2.col3' ]).from({'table2' : 't2'}).where({ 't2.col1': 'efg' });
        var unionStatement = statement1.union(statement2);

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = unionStatement.toQuery();
        test.equal(query.sql, 'select t1.col1, t1.col2, t1.col3 from table1 t1 where t1.col1 = ? union select t2.col1, t2.col2, t2.col3 from table2 t2 where t2.col1 = ?');
        test.deepEqual(query.values, [ 'abc', 'efg' ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = unionStatement.toQuery();
        test.equal(query.sql, 'select t1.col1, t1.col2, t1.col3 from table1 t1 where t1.col1 = $1 union select t2.col1, t2.col2, t2.col3 from table2 t2 where t2.col1 = $2');
        test.deepEqual(query.values, [ 'abc', 'efg' ]);

        test.done();
    }
};

