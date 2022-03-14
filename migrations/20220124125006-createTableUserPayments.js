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

const TABLE_NAME = 'userPayments';


exports.up = function(db) {
  return db.schema.createTable(TABLE_NAME, function(userPayments) {
    userPayments.increments('id').unsigned().primary();
    userPayments.integer('userId').unsigned().notNull().references('id').inTable('users').onDelete('cascade').onUpdate('restrict');
    userPayments.integer('subscriptionType').unsigned().notNull();
    userPayments.string('accountId').notNull();
    userPayments.string('orderId').notNull();
    userPayments.string('paymentId').notNull();
    userPayments.float('amount',10,2).notNull();
    userPayments.string('currency').notNull();
    userPayments.string('method').notNull();
    userPayments.string('bank').notNull();
    userPayments.string('email').notNull();
    userPayments.string('phoneNumber').notNull();
    userPayments.timestamp('paidOn').defaultTo(db.fn.now());

    //other info
    userPayments.timestamp('updatedOn').defaultTo(db.fn.now());
    userPayments.timestamp('createdOn').defaultTo(db.fn.now());
     
  });
};

exports.down = function(db) {
  return db.schema.dropTable(TABLE_NAME);
};

exports._meta = {
  "version": 1
};
