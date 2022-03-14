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

const TABLE_NAME = 'users';

exports.up = function(db) {
  return db.schema.createTable(TABLE_NAME, function(user) {
    user.increments('id').unsigned().primary();
    user.string('name').notNull();
    user.string('email').notNull().unique();
    user.string('password').notNull();
    user.string('phoneNumber').notNull();
    user.string('temporaryPassword').notNull();
    user.string('token').notNull();
    user.string('aliceUserName').notNull();
    user.string('alicePassword').notNull();
    user.string('aliceAnswer').notNull();
    user.string('aliceToken').notNull();
    user.string('aliceBranchCode').notNull();
    user.string('userType').notNull();
    user.string('subscriptionType').notNull();
    user.timestamp('subscriptionExpireOn').defaultTo(db.fn.now());

    //other info
    user.timestamp('updatedOn').defaultTo(db.fn.now());
    user.timestamp('createdOn').defaultTo(db.fn.now());
   
});
};

exports.down = function(db) {

  return db.schema.dropTable(TABLE_NAME);

};

exports._meta = {
  "version": 1
};
