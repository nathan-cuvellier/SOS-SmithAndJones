const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
const { check, validationResult } = require('express-validator');

ROUTER.get('/', (req, res) => {
    res.render(__dirname + '/../../../public/ticket/add.ejs', { errors: {} })
})

ROUTER.post('/', [
    check('title', 'Le titre doit comporter au minimum 5 caractères').isLength({ min: 5 }),//.withMessage('not email')
    check('description', 'La description doit comporter au minimum 20 caracteres').isLength({ min: 20}, { ignore_whitespace:false })
],
    (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.status(422)
        }

        res.render(__dirname + '/../../../public/ticket/add.ejs', { errors: errors.array() })
    })


module.exports = ROUTER;