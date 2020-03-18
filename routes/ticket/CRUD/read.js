const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
let con = require('./../../../db')

ROUTER.get('/:id', (req, res) => {

    let query = "SELECT * FROM TICKET t" +
        " JOIN POSTE_DE_TRAVAIL pdt ON pdt.ID_poste = t.ID_poste" +
        " JOIN PRIORITE p ON p.id_priorite = t.ID_PRIORITE" +
        " JOIN CATEGORIE c on c.id_categorie = t.ID_CATEGORIE" +
        " WHERE t.ID_ticket = ?" +
        " LIMIT 1"


   con.query(query, req.params.id, (err,rows) => {
        if(err) throw err;
        console.log(req.params)
        res.render(__dirname + '/../../../public/ticket/CRUD/read.ejs', {ticket : rows[0]})
    });
  
})


module.exports = ROUTER;
