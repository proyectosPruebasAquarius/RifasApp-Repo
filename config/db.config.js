'use strict';
const mysql = require('mysql');
//local mysql db connection
const conn = mysql.createConnection({
  host     : 'b9kexcbzj9b0b4imcgzh-mysql.services.clever-cloud.com',
  user     : 'ug4azy6jeyi3sh4j',
  password : 'XgdYVm6dY3X8DI5GZ9lA',
  database : 'b9kexcbzj9b0b4imcgzh'
});
dbConn.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
});
module.exports = conn;