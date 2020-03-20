const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
let con = require('./../../../db')
const {check, validationResult} = require('express-validator');

ROUTER.get('/', (req, res) =>
{
    // get all computers; all priorities; all categories;
    con.query('SELECT * FROM POSTE_DE_TRAVAIL;SELECT * FROM PRIORITE;SELECT * FROM CATEGORIE', (err, rows) =>
    {
        if (err) throw err
        res.render(__dirname + '/../../../public/ticket/CRUD/create.ejs', {
            workplace: rows[0],
            priorities: rows[1],
            categories: rows[2],
            errors: {}
        })
    })
})

ROUTER.post('/', [
        check('title', 'Le titre doit comporter au minimum 5 caractères')
            .trim()
            .isLength({min: 5, max: 100}),

        check('description', 'La description doit comporter au minimum 20 caractères')
            .trim()
            .isLength({min: 20}),

        check('id_computer', 'Le poste concerné doit être définie correctement')
            .isInt(),

        check('priority', 'La priorité doit être définie correctement')
            .isInt(),

        check('URL', 'Le fichier doit être en png ou jpeg de maximum 5Mo')
            .custom((value, {req}) =>
                req.files === null ||
                req.files.URL === null ||
                ["image/jpeg", "image/png"].includes(req.files.URL.mimetype) && !req.files.URL.truncated),

        check('id_category', 'La categorie doit être définie correctement')
            .isInt(),

        check('specify', 'Le champ "préciser" ne doit pas dépasser 255 caractères')
            .isLength({max: 255})
    ],
    (req, res) =>
    {
        /**
         * Get array of errors
         * @type {Result<{param: "_error"; msg: any; nestedErrors: ValidationError[]; location?: undefined; value?: undefined} | {location: Location; param: string; value: any; msg: any; nestedErrors?: unknown[]}>}
         */
        const errors = validationResult(req)
        /**
         * Var use in order to display a pop up for user with a message of success
         */
        let success = null

        if (!errors.isEmpty()) {
            res.status(422)
            getView(res, errors, success)
        } else {
            con.query('SELECT id_priorite from PRIORITE;SELECT ID_poste FROM POSTE_DE_TRAVAIL;SELECT id_categorie FROM CATEGORIE', [],
                (err, rows) =>
                {
                    if (err) throw err;

                    let id_priorites = []
                    for (let id_priorite of rows[0])
                        id_priorites.push(id_priorite['id_priorite'])

                    let id_computers = []
                    for (let id_computer of rows[1])
                        id_computers.push(id_computer['ID_poste'])

                    let id_categories = []
                    for (let id_categorie of rows[2])
                        id_categories.push(id_categorie['id_categorie'])

                    let id_priorite = parseInt(req.body.priority)
                    let id_computer = parseInt(req.body.id_computer)
                    let id_categorie = parseInt(req.body.id_category)
                    /**
                     * If user change manually in html and that the key does not exist in database
                     */
                    if (!id_priorites.includes(id_priorite) || !id_computers.includes(id_computer) || !id_categories.includes(id_categorie))
                        return res.status(403).send(err);
                    else {
                        con.query('INSERT INTO TICKET SET ?',
                            {
                                'ID_UTILISATEUR': 1,
                                'ID_poste': id_computer,
                                'ID_PRIORITE': id_priorite,
                                'UTI_ID_UTILISATEUR': 1,
                                'DESCRIPTION': req.body.description.trim(),
                                'STATUS': 'en cours',
                                'CREATED_AT': new Date(),
                                'TITRE': req.body.title.trim(),
                                'ID_CATEGORIE': id_categorie,
                                'PRECISER': req.body.specify.length === 0 ? null : req.body.specify
                            },
                            (err, rows) =>
                            {
                                if (err) throw err;

                                if (req.files !== null && req.files.URL !== null) {
                                    let split = req.files.URL.name.split('.')
                                    let ext = split[split.length - 1]

                                    // insert file
                                    req.files.URL.mv('attachment/' + (new Date()).valueOf() + "." + ext, function (err)
                                    {
                                        if (err)
                                            return res.status(500).send(err);
                                    });
                                }

                                success = true

                                getView(res, errors, success)
                            });


                    }
                }
            )
        }

    })

/**
 *
 * @param res
 * @param errors
 * @param success
 */
function getView(res, errors, success)
{
    con.query('SELECT * FROM POSTE_DE_TRAVAIL;SELECT * FROM PRIORITE;SELECT * FROM CATEGORIE', [], (err, rows) =>
    {
        if (err) throw err
        res.render(__dirname + '/../../../public/ticket/CRUD/create.ejs', {
            workplace: rows[0],
            priorities: rows[1],
            categories: rows[2],
            errors: errors.array(),
            success: success
        })
    })
}

module.exports = ROUTER;