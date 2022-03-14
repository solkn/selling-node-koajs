import * as config from 'config';

const knex = require('knex');

export const db = knex({
  client:'mysql',
  connection:config.get('mysql'),
  migrations:{
    directory:"./migrations"
  },
});

if(!db){
  console.log("database is not connected successfully!");
}
else{
  console.log("database is connected successfully!");

}
db.migrate.latest();

