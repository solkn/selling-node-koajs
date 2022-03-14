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

const TABLE_NAME = 'userSymbols';


exports.up = function(db) {
  return db.schema.createTable(TABLE_NAME, function(userSymbols) {
    userSymbols.increments('id').unsigned().primary();
    userSymbols.integer('userId').unsigned().notNull().references('id').inTable('users').onDelete('cascade').onUpdate('restrict');
    userSymbols.integer('symbolAliasId').unsigned().notNull().references('id').inTable('symbolAliases').onDelete('cascade').onUpdate('restrict');

    //other info
    userSymbols.timestamp('updatedOn').defaultTo(db.fn.now());
    userSymbols.timestamp('createdOn').defaultTo(db.fn.now());
     
  });
};

exports.down = function(db) {
  return db.schema.dropTable(TABLE_NAME);
};

exports._meta = {
  "version": 1
};
