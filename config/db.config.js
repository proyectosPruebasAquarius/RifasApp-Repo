'use strict';
const mysql = require('mysql');
const { promisify } = require('util');
//local mysql db connection
const { database } = require('../keys');
const pool = mysql.createPool(database);
pool.getConnection((err, connection) => {
  if(err){
    if(err.code === 'PROTOCOL_CONNECTION_LOST'){
      console.error('Database connection was close');
    }
    if(err.code === 'ER_CON_COUNT_ERROR'){
      console.error('Database has to many connections');
    }
    if(err.code === 'ECONNREFUSED'){
      console.error('Database connection was refused');
    }
  }
  if(connection) connection.release();
  console.log('DB is connect!');
  return;
})
pool.query = promisify(pool.query);

module.exports = pool;