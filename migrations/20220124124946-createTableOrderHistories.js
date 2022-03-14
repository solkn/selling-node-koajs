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

const TABLE_NAME = 'orderHistories';


exports.up = function(db) {
  return db.schema.createTable(TABLE_NAME, function(orderHistory) {
    orderHistory.increments('id').unsigned().primary();
    orderHistory.integer('userId').unsigned().notNull().references('id').inTable('users').onDelete('cascade').onUpdate('restrict');
    orderHistory.integer('levelId').unsigned().notNull().references('id').inTable('levels').onDelete('cascade').onUpdate('restrict');
    orderHistory.string('orderId').notNull();
    orderHistory.string('orderType').notNull();
    orderHistory.integer('quantity').notNull();
    orderHistory.float('price',10,2).notNull();
    orderHistory.float('triggerPrice',10,2).notNull();
    orderHistory.float('stopLoss',10,2).notNull();
    orderHistory.float('target',10,2).notNull();
    orderHistory.string('bracketType').notNull();
    orderHistory.string('month').notNull();
    orderHistory.string('tradeType').notNull();

    //other info
    orderHistory.timestamp('updatedOn').defaultTo(db.fn.now());
    orderHistory.timestamp('createdOn').defaultTo(db.fn.now());
     
  });
};

exports.down = function(db) {
  return db.schema.dropTable(TABLE_NAME);
};

exports._meta = {
  "version": 1
};
