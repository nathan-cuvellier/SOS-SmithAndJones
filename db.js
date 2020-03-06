let mysql = require('mysql')

let con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true
  });
  
  con.connect((err) => {
    if(err){
      console.log(err)
      return;
    }
    console.log('Connection OK')
  });

  module.exports = con