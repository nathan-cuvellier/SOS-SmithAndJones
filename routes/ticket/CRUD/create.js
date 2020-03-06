const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
let con = require('./../../../db')
const { check, validationResult } = require('express-validator');

ROUTER.get('/', (req, res) => {

    con.query('SELECT * FROM POSTE_DE_TRAVAIL;SELECT * FROM PRIORITE', (err, rows) => {
        if (err) throw err
        res.render(__dirname + '/../../../public/ticket/CRUD/create.ejs', { workplace: rows[0], priority: rows[1], errors: {} })
    })
})

ROUTER.post('/', [
    check('title', 'Le titre doit comporter au minimum 5 caractères')
        .trim()
        .isLength({ min: 5 }),//.withMessage('not email')

    check('description', 'La description doit comporter au minimum 20 caractères')
        .trim()
        .isLength({ min: 20 }),

    check('priority', 'La priorité doit être définie correctement')
        .isInt()
],
    (req, res) => {

        const errors = validationResult(req)

        

        if (!errors.isEmpty())
            res.status(422)
        else {
            if (req.files.URL != null) {
                req.files.URL.mv('attachment/' +req.files.URL.name , function (err) {
                    if (err)
                        return res.status(500).send(err);
    
                    res.send('File uploaded!');
                });
            }
        }

        con.query('SELECT * FROM POSTE_DE_TRAVAIL;SELECT * FROM PRIORITE', [], (err, rows) => {
            if (err) throw err
            res.render(__dirname + '/../../../public/ticket/CRUD/create.ejs', { workplace: rows[0], priority: rows[1], errors: errors.array() })
        })
    })


module.exports = ROUTER;