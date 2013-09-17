
var sql = require('../../lib');

exports.operators = {
    "Equal operator" : function (test) {
        var statement = sql.select([ 'col1' ]).from({'table1' : 't1'}).where({ 'col1' : 'abc' });

        sql.parameterStyle = sql.PARAMETER_STYLE_UNINDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1 from table1 t1 where col1 = ?');
        test.deepEqual(query.values, [ 'abc' ]);

        sql.parameterStyle = sql.PARAMETER_STYLE_INDEXED;
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1 from table1 t1 where col1 = $1');
        test.deepEqual(query.values, [ 'abc' ]);

        test.done();
    }
};

