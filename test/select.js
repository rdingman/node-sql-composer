
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

    "Where clause with number": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).where({'col4' : 123 });
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 = ?');
        test.deepEqual(query.values, [ 123 ]);
        test.done();
    },

    "Where clause with string": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).where({'col4' : 'abc' });
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 = ?');
        test.deepEqual(query.values, [ 'abc' ]);
        test.done();
    },

    "Where clause with boolean": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).where({'col4' : true });
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 = true');
        test.deepEqual(query.values, [ ]);
        test.done();
    },

    "Where clause with null": function (test) {
        var statement = sql.select([ 'col1', 'col2', 'col3' ]).from({'table1' : 't1'}).where({'col4' : null });
        var query = statement.toQuery();
        test.equal(query.sql, 'select col1, col2, col3 from table1 t1 where col4 is null');
        test.deepEqual(query.values, [ ]);
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

