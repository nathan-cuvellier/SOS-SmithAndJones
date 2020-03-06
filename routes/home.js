const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
let con = require('./../db')



ROUTER.get('/', (req, res) => {



    con.query('SELECT * FROM TICKET;SELECT * FROM POSTE_DE_TRAVAIL', (err,rows) => {
    console.log(rows);
        if(err) throw err;
        res.render(__dirname + '/../public/index.ejs', { tickets : rows[0], postes : rows[1]  , errors: {} })
    });
  
})


module.exports = ROUTER;