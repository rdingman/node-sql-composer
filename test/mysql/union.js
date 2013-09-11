
var sql = require('../../lib');

exports.select = {
    "Basic union" : function (test) {
        var statement1 = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'});
        var statement2 = sql.select([ 'col1', 'col2', 'col3' ]).from({'table2' : 't2'});

        var query = statement1.union(statement2).toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 union select col1, col2, col3 from table2 t2');
        test.done();
    }
};

