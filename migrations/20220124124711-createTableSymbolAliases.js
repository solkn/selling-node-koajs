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

const TABLE_NAME = 'symbolAliases';


exports.up = function(db) {
  return db.schema.createTable(TABLE_NAME, function(symbolAliases) {
    symbolAliases.increments('id').unsigned().primary();
    symbolAliases.string('name').notNull();
    symbolAliases.string('alias').notNull().unique();
    symbolAliases.string('company').notNull();
    symbolAliases.string('exchange').notNull();
    symbolAliases.string('otherData').notNull();
    symbolAliases.string('platform').notNull();
    //other info
    symbolAliases.timestamp('updatedOn').defaultTo(db.fn.now());
    symbolAliases.timestamp('createdOn').defaultTo(db.fn.now());

     
  });
};

exports.down = function(db) {
  return db.schema.dropTable(TABLE_NAME);
};

exports._meta = {
  "version": 1
};
