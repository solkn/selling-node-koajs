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

const TABLE_NAME = 'levels';

exports.up = function(db) {
  return db.schema.createTable(TABLE_NAME, function(level) {
    level.increments('id').unsigned().primary();
    level.integer('signalId').unsigned().notNull();
    level.string('symbolName').notNull();
    level.string('symbolAlias').notNull().unique();
    level.string('exchange').notNull();
    level.integer('digit').notNull();
    level.float('buyPrice',10,2).notNull();
    level.float('buyTarget1',10,2).notNull();
    level.float('buyTarget2',10,2).notNull();
    level.float('buyTarget3',10,2).notNull();
    level.float('sellPrice',10,2).notNull();
    level.float('sellTarget1',10,2).notNull();
    level.float('sellTarget2',10,2).notNull();
    level.float('sellTarget3',10,2).notNull();
    level.float('stopLoss',10,2).notNull();

    //other info
    level.timestamp('updatedOn').defaultTo(db.fn.now());
    level.timestamp('createdOn').defaultTo(db.fn.now());
     
  });
};

exports.down = function(db) {
  return db.schema.dropTable(TABLE_NAME);
};

exports._meta = {
  "version": 1
};
