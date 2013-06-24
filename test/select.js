
var sql = require('../lib');

exports.select = {
    "Basic select" : function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'});
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1');
        test.done();
    },

    "Adding columns to query after": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).select(['col4']);
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3, col4 from table1 t1');
        test.done();
    },

    "Where clause": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).where({'col4' : 123 });
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 = ?');
        test.deepEqual(query.values, [ 123 ]);
        test.done();
    },

    "Where clause 2": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).where({'col4' : 'abc' });
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 = ?');
        test.deepEqual(query.values, [ 'abc' ]);
        test.done();
    },


    "Order by": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).orderBy({ 'col1' : null, 'col2' : 'desc' });
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 order by col1, col2 desc');
        test.done();
    },

    "Limit clause": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).limit(100, 5);
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 limit 100 offset 5');
        test.done();
    }
};

