const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
let con = require('./../../../db')
const { check, validationResult } = require('express-validator');

ROUTER.get('/', (req, res) => {

    con.query('SELECT * FROM POSTE_DE_TRAVAIL', (err,rows) => {
        if(err) throw err;
        res.render(__dirname + '/../../../public/ticket/add.ejs', { workplace : rows , errors: {} })
      });
})

ROUTER.post('/', [
    check('title', 'Le titre doit comporter au minimum 5 caractères')
        .trim()
        .isLength({ min: 5 }),//.withMessage('not email')

    check('description', 'La description doit comporter au minimum 20 caracteres')
        .trim()
        .isLength({ min: 20 })
],
    (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.status(422)
        }

        res.render(__dirname + '/../../../public/ticket/add.ejs', { errors: errors.array() })
    })


module.exports = ROUTER;