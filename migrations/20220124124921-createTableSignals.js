'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};


const TABLE_NAME = 'signals';

exports.up = function(db) {
  return db.schema.createTable(TABLE_NAME, function(signal) {
    signal.increments('id').unsigned().primary();
    signal.integer('signalId').unsigned().notNull();
    signal.string('symbolName').notNull();
    signal.string('symbolAlias').notNull().unique();
    signal.string('exchange').notNull();
    signal.string('orderType').notNull();
    signal.float('price',10,2).notNull();
    signal.float('target1',10,2).notNull();
    signal.float('target2',10,2).notNull();
    signal.float('target3',10,2).notNull();
    signal.float('stopLoss',10,2).notNull();
    signal.float('profit1',10,2).notNull();
    signal.float('profit2',10,2).notNull();
    signal.float('profit3',10,2).notNull();
    signal.float('totalProfit',10,2).notNull();

    //other info
    signal.timestamp('updatedOn').defaultTo(db.fn.now());
    signal.timestamp('createdOn').defaultTo(db.fn.now());
     
  });
};

exports.down = function(db) {
  return db.schema.dropTable(TABLE_NAME);
};

exports._meta = {
  "version": 1
};
