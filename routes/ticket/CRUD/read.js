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

    let comment = "SELECT * from COMMENTAIRE c" +
        " JOIN UTILISATEUR u ON u.ID_UTILISATEUR = c.id_utilisateur" +
        " WHERE c.ID_ticket = ?"

    let id_ticket = parseInt(req.params.id)
   con.query(query+";"+comment, [id_ticket, id_ticket], (err,rows) => {
        if(err) throw err;
        console.log(rows[1])
        res.render(__dirname + '/../../../public/ticket/CRUD/read.ejs', {ticket : rows[0][0], comments: rows[1]})
    });
  
})

ROUTER.post('/:id', (req, res) => {
    if(req.body.send_comment !== undefined) {
        con.query("INSERT INTO COMMENTAIRE SET created_at = NOW(), ?",
            {
                'ID_ticket': req.params.id,
                'id_utilisateur': 3,
                'TEXT': req.body.comment
            }, (err,rows) => {
            if(err) throw err;
            res.render(__dirname + '/../../../public/ticket/CRUD/read.ejs', {ticket : rows[0]})
        });
    }

    return res.redirect('/ticket/read/' + req.params.id)
})


module.exports = ROUTER;
