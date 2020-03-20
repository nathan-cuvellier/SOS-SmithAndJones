const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
let con = require('./../../../db')
const {check, validationResult} = require('express-validator');

ROUTER.get('/:id', (req, res) =>
{
    showTicket(req, res)
})

ROUTER.post('/:id', [
    check('comment', 'Le commentaire doit comporter au minimum 5 caractères')
        .trim()
        .isLength({min: 5})
], (req, res) =>
{
    /**
     * Get array of errors
     * @type Result<{param: "_error"; msg: any; nestedErrors: ValidationError[]; location?: undefined; value?: undefined} | {location: Location; param: string; value: any; msg: any; nestedErrors?: unknown[]}>
     */
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(422)
        // show page of ticket with data errors
        return showTicket(req, res, errors.array())
    }

    // make sure that id is number
    if (isNaN(req.params.id))
        return res.status(403).send("")

    if (req.body.send_comment !== undefined) {
        con.query("SELECT STATUS FROM TICKET WHERE ID_ticket = ?", req.params.id,
            (err, rows) =>
            {
                if (err) throw err;
                console.log(rows.length === 1, rows[0].STATUS !== "terminé")
                if (rows.length === 1 && rows[0].STATUS !== "terminé") {
                    con.query("INSERT INTO COMMENTAIRE SET created_at = NOW(), ?",
                        {
                            'ID_ticket': req.params.id,
                            'id_utilisateur': 3,
                            'TEXT': req.body.comment
                        }, (err, rows) =>
                        {
                            if (err) throw err;
                            // redirect after all request is finish
                            return res.redirect('/ticket/read/' + req.params.id)
                        });
                }
            });
    }


})

/**
 * get information of one ticket
 * @returns {string}
 */
function queryTicket(){
    return "SELECT * FROM TICKET t" +
    " JOIN POSTE_DE_TRAVAIL pdt ON pdt.ID_poste = t.ID_poste" +
    " JOIN PRIORITE p ON p.id_priorite = t.ID_PRIORITE" +
    " JOIN CATEGORIE c on c.id_categorie = t.ID_CATEGORIE" +
    " WHERE t.ID_ticket = ?" +
    " LIMIT 1"
}

/**
 * Get all comment of one ticket
 * @returns {string}
 */
function queryComment(){
    return "SELECT * from COMMENTAIRE c" +
        " JOIN UTILISATEUR u ON u.ID_UTILISATEUR = c.id_utilisateur" +
        " WHERE c.ID_ticket = ?"
}

/**
 *
 * @param req
 * @param res
 * @param errors
 * @returns {*|void}
 */
function showTicket(req, res, errors = {}){
    let query = queryTicket()
    let comment = queryComment()

    // make sure that id is number
    if(isNaN(req.params.id))
        return res.status(403).send("")

    let id_ticket = parseInt(req.params.id)
    con.query(query + ";" + comment, [id_ticket, id_ticket], (err, rows) =>
    {
        if (err) throw err;
        return res.render(__dirname + '/../../../public/ticket/CRUD/read.ejs', {ticket: rows[0][0], comments: rows[1], errors: errors})
    });
}


module.exports = ROUTER;
