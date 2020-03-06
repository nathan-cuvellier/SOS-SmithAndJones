const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
let con = require('./../../../db')

ROUTER.get('/', (req, res) => {

    con.query('SELECT * FROM TICKET;SELECT * FROM POSTE_DE_TRAVAIL', (err,rows) => {
        if(err) throw err;

        console.log(req.params)
        res.render(__dirname + '/../../../public/ticket/CRUD/read.ejs', {idticket: req.params.id, tickets : rows[0], postes : rows[1]  , errors: {} })
    });
  
})


module.exports = ROUTER;
