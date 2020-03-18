const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
let con = require('./../db')



ROUTER.get('/', (req, res) => {

    let query = "SELECT * FROM TICKET t" +
                " JOIN POSTE_DE_TRAVAIL pdt ON pdt.ID_poste = t.ID_poste" +
                " JOIN PRIORITE p ON p.id_priorite = t.ID_PRIORITE" +
                " JOIN CATEGORIE c on c.id_categorie = t.ID_CATEGORIE"
    con.query(query, (err,rows) => {
        if(err) throw err;
        res.render(__dirname + '/../public/index.ejs', { tickets : rows })
    });
  
})


module.exports = ROUTER;