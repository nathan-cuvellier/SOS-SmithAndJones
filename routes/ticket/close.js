const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
let con = require('./../../db')

ROUTER.post('/:id', (req, res) =>
    {
        if(isNaN(req.params.id))
            return res.status(403).send("");

        con.query('UPDATE TICKET SET STATUS = "terminé" WHERE ID_ticket = ?', req.params.id, (err, rows) =>
        {
            if (err) throw err;
            res.redirect('/ticket/read/' + req.params.id)
        });

    }
)

module.exports = ROUTER;