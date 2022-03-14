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

const TABLE_NAME = 'userFcmTokens';


exports.up = function(db) {
  return db.schema.createTable(TABLE_NAME, function(userFcmTokens) {
    userFcmTokens.increments('id').unsigned().primary();
    userFcmTokens.integer('userId').unsigned().notNull().references('id').inTable('users').onDelete('cascade').onUpdate('restrict');
    userFcmTokens.string('fcmToken').notNull();
    //other info
    userFcmTokens.timestamp('updatedOn').defaultTo(db.fn.now());
    userFcmTokens.timestamp('createdOn').defaultTo(db.fn.now());
     
  });
};

exports.down = function(db) {
  return db.schema.dropTable(TABLE_NAME);
};

exports._meta = {
  "version": 1
};
