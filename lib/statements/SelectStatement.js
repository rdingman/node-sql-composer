var util = require('util');
var assert = require('assert');
var Statement = require('./Statement');
var Column = require('./Column');
var Table = require('./Table');
var Join = require('./Join');
var SortDescriptor = require('./SortDescriptor');
var Predicate = require('../predicates/Predicate');

function SelectStatement(options) {
    Statement.call(this);

    
    this.tableMap = {};

    this.modifiers = [];
    this.columns = [];
    this.tables = [];
    this.joins = [];
    this.predicates = [];
    this.groupColumns = [];
    this.havingPredicates = [];
    this.sortDescriptors = [];

    this.select(options);
}

util.inherits(SelectStatement, Statement);

SelectStatement.prototype.addModifier = function(modifier) {
    this.modifiers.push(modifier);
};

SelectStatement.prototype.toQuery = function () {
    assert(this.columns.length > 0, 'A select statement must have at least one column');
    assert(this.tables.length > 0, 'A select statement must have at least one table');

    var values = [];
    var sqlFragments = [ 'select' ];
    sqlFragments = sqlFragments.concat(this.modifiers);

    var columnSQL = [];
    this.columns.forEach(function (column) {
        columnSQL.push(column.toSQL());
    });

    sqlFragments.push(columnSQL.join(', '));
    sqlFragments.push('from');

    var tableSQL = [];
    this.tables.forEach(function (table) {
        tableSQL.push(table.toSQL());
    });
    sqlFragments.push(tableSQL.join(', '));

    this.joins.forEach(function (join) {
        var query = join.toQuery();
        sqlFragments.push(query.sql);
        values = values.concat(query.values);
    });

    if (this.predicates.length > 0) {
        sqlFragments.push('where');
        var predicateFragments = [];
        this.predicates.forEach(function (predicate) {
            var query = predicate.toQuery();
            predicateFragments.push(query.sql);
            values = values.concat(query.values);
        });
        sqlFragments.push(predicateFragments.join(' and '));
    }

    if (this.groupColumns.length > 0) {
        sqlFragments.push('group by');

        var groupSQL = [];
        this.groupColumns.forEach(function (column) {
            groupSQL.push(column.toSQL());
        });

        sqlFragments.push(groupSQL.join(', '));
    }

    if (this.havingPredicates.length > 0) {
        sqlFragments.push('having');
        var havingFragments = [];

        this.havingPredicates.forEach(function (predicate) {
            var query = predicate.toQuery();
            havingFragments.push(query.sql);
            values = values.concat(query.values);
        });

        sqlFragments.push(havingFragments.join(' and '));
    }

    if (this.sortDescriptors.length > 0) {
        sqlFragments.push('order by');
        var fragments = [];

        this.sortDescriptors.forEach(function (sortDescriptor) {
            var sql = sortDescriptor.toSQL();
            fragments.push(sql);
        });

        sqlFragments.push(fragments.join(', '));
    }

    if (this.limitSpecifier) {
        sqlFragments.push('limit');
        sqlFragments.push(this.limitSpecifier.count);
        if (this.limitSpecifier.offset) {
            sqlFragments.push('offset');
            sqlFragments.push(this.limitSpecifier.offset);
        }
    }

    sql = sqlFragments.join(' ');
    return { sql: sql, values: values };
};


SelectStatement.prototype.select = function (options) {
    this.columns = this.columns.concat(Column.parse(options));
    return this;
};

SelectStatement.prototype.from = function (options) {
    for (var name in options) {
        if (!options.hasOwnProperty(name)) {
            continue;
        }

        var alias = options[name] || name;

        if (this.tableMap[alias]) {
            throw new Error('There is already a table aliased as: ' + alias);
        }

        var table = new Table(name, alias);
        this.tables.push(table);
 
        this.tableMap[alias] = table;
    }

    return this;
};

SelectStatement.prototype.join = function (tableSpecifier, predicateSpecifier, joinType) {
    var predicate = Predicate.parse(predicateSpecifier, true);
    var table = null;

    if (typeof(tableSpecifier) === 'object') {
        var name = Object.keys(tableSpecifier)[0];
        var alias = tableSpecifier[name];
        table = new Table(name, alias);
    } else if (typeof(tableSpecifier) === 'string') {
        table = new Table(tableSpecifier, null);
    } else {
        throw Error('Table specifier must be either an object or a string');
    }

    var join = new Join(table, predicate, joinType);
    this.joins.push(join);

    return this;
};

SelectStatement.prototype.innerJoin = function (tableSpecifier, predicateSpecifier) {
    return this.join(tableSpecifier, predicateSpecifier, 'inner');
};

SelectStatement.prototype.leftOuterJoin = function (tableSpecifier, predicateSpecifier) {
    return this.join(tableSpecifier, predicateSpecifier, 'left outer');
};

SelectStatement.prototype.rightOuterJoin = function (tableSpecifier, predicateSpecifier) {
    return this.join(tableSpecifier, predicateSpecifier, 'right outer');
};

SelectStatement.prototype.fullOuterJoin = function (tableSpecifier, predicateSpecifier) {
    return this.join(tableSpecifier, predicateSpecifier, 'full outer');
};

SelectStatement.prototype.where = function (options) {
    this.predicates.push(Predicate.parse(options));
    return this;
};

SelectStatement.prototype.groupBy = function (options) {
    this.groupColumns = this.groupColumns.concat(Column.parse(options));
    return this;
};

SelectStatement.prototype.having = function (options) {
    this.havingPredicates.push(Predicate.parse(options));
    return this;
};

SelectStatement.prototype.orderBy = function (options) {
    this.sortDescriptors = this.sortDescriptors.concat(SortDescriptor.parse(options));
    return this;
};

SelectStatement.prototype.limit = function (count, offset) {
    assert(typeof(count) === 'number');

    if (typeof(offset) !== 'undefined') {
        assert(typeof(offset) === 'number');
    }

    this.limitSpecifier = { count: count, offset: offset };
    return this;
};

SelectStatement.prototype.union = function (statement) {
    var UnionStatement = require('./UnionStatement');
    return new UnionStatement([ this, statement ]);
};

module.exports = SelectStatement;

