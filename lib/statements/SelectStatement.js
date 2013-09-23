var util = require('util');
var assert = require('assert');
var Statement = require('./Statement');
var Column = require('./Column');
var Table = require('./Table');
var Join = require('./Join');
var SortDescriptor = require('./SortDescriptor');
var Predicate = require('../predicates/Predicate');
var AndPredicate = require('../predicates/AndPredicate');

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
        var tableQuery = table.toQuery();
        tableSQL.push(tableQuery.sql);
        values = values.concat(tableQuery.values);
    });
    sqlFragments.push(tableSQL.join(', '));

    this.joins.forEach(function (join) {
        var query = join.toQuery();
        sqlFragments.push(query.sql);
        values = values.concat(query.values);
    });

    if (this.predicates.length > 0) {
        sqlFragments.push('where');
        var andPredicate = new AndPredicate(this.predicates);
        andPredicate.parent = this;
        var whereQuery = andPredicate.toQuery();
        sqlFragments.push(whereQuery.sql);
        values = values.concat(whereQuery.values);
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
        var andPredicate = new AndPredicate(this.havingPredicates);
        andPredicate.parent = this;
        var havingQuery = andPredicate.toQuery();
        sqlFragments.push(havingQuery.sql);
        values = values.concat(havingQuery.values);
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
    var columns = Column.parse(options);
    var self = this;
    columns.forEach(function (column) {
        column.parent = self;
    });
    
    this.columns = this.columns.concat(columns);
    return this;
};

SelectStatement.prototype.from = function (options, alias) {
    if (options instanceof SelectStatement) {
        var table = new Table(options, alias);
        options.parent = this;
        this.tables.push(table);
    } else {
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
    }

    return this;
};

SelectStatement.prototype.join = function (tableSpecifier, predicateSpecifier, joinType) {
    var predicates = Predicate.parse(predicateSpecifier, true);
    var predicate = new AndPredicate(predicates);
    predicate.parent = this;

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
    var predicates = Predicate.parse(options);
    var self = this;
    predicates.forEach(function (predicate) {
        predicate.parent = self;
    });
    this.predicates = this.predicates.concat(predicates);
    return this;
};

SelectStatement.prototype.groupBy = function (options) {
    var columns = Column.parse(options);
    var self = this;
    columns.forEach(function (column) {
       column.parent = self; 
    });

    this.groupColumns = this.groupColumns.concat(columns);
    return this;
};

SelectStatement.prototype.having = function (options) {
    var havingPredicates = Predicate.parse(options);
    var self = this;
    havingPredicates.forEach(function (havingPredicate) {
        havingPredicate.parent = self;
    });
    
    this.havingPredicates = this.havingPredicates.concat(havingPredicates);
    return this;
};

SelectStatement.prototype.orderBy = function (options) {
    var sortDescriptors = SortDescriptor.parse(options);
    var self = this;
    sortDescriptors.forEach(function (sortDescriptor) {
        sortDescriptor.parent = self;
    });

    this.sortDescriptors = this.sortDescriptors.concat(sortDescriptors);
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

