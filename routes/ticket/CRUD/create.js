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
        .isInt(),

    check('URL', 'Le fichier doit être en png ou jpeg').custom((value, { req }) => 
        req.files === null ||
        req.files.URL === null ||
        ["image/jpeg","image/png"].includes(req.files.URL.mimetype))
],
    (req, res) => {

        const errors = validationResult(req)


        if (!errors.isEmpty())
            res.status(422)
        else {
            if (req.files !== null && req.files.URL !== null) {
                let split = req.files.URL.name.split('.')
                let ext = split[split.length - 1]
                
                req.files.URL.mv('attachment/' + (new Date()).valueOf() + "." +  ext , function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
            }
        }

        con.query('SELECT * FROM POSTE_DE_TRAVAIL;SELECT * FROM PRIORITE', [], (err, rows) => {
            if (err) throw err
            res.render(__dirname + '/../../../public/ticket/CRUD/create.ejs', { workplace: rows[0], priority: rows[1], errors: errors.array() })
        })
    })


module.exports = ROUTER;