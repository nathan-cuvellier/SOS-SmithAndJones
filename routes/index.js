const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();
let con = require('./../db')


ROUTER.get('/', (req, res) =>
{
    let id_role = 1 // wait session

    if(id_role === 1)
        operatorManager(req, res)
    else if(id_role === 2)
        applicant(req, res)

})

function applicant(req, res){

    let tickets = "SELECT * FROM TICKET t" +
        " JOIN UTILISATEUR u ON u.ID_UTILISATEUR = t.ID_UTILISATEUR" +
        " JOIN ROLE r ON r.id_role = u.ID_ROLE" +
        " JOIN POSTE_DE_TRAVAIL pdt ON pdt.ID_poste = t.ID_poste" +
        " JOIN PRIORITE p ON p.id_priorite = t.ID_PRIORITE" +
        " JOIN CATEGORIE c on c.id_categorie = t.ID_CATEGORIE" +
        " WHERE u.ID_UTILISATEUR = ?"

    con.query(tickets, [2],(err, rows) =>
    {
        if (err) throw err;

        res.render(__dirname + '/../public/home/applicant.ejs', {tickets: rows})
    });
}

function operatorManager(req, res){
    if(req.query.reset)
        return res.redirect('/')

    let tickets = "SELECT * FROM TICKET t" +
        " JOIN UTILISATEUR u ON u.ID_UTILISATEUR = t.ID_UTILISATEUR" +
        " JOIN POSTE_DE_TRAVAIL pdt ON pdt.ID_poste = t.ID_poste" +
        " JOIN PRIORITE p ON p.id_priorite = t.ID_PRIORITE" +
        " JOIN CATEGORIE c on c.id_categorie = t.ID_CATEGORIE"

    /**
     * this variable is use in order to add a "WHERE" or "AND" in the query
     * @type {boolean}
     */
    let where = false
    /**
     * Var use to avoid the injection SQL
     * @type {*[]}
     */
    let params = []


    if (req.query.status) {
        tickets += " WHERE t.STATUS = ?"
        params.push(req.query.status)
        where = true
    }

    if (req.query.priority && !isNaN(req.query.priority)) {
        if (where)
            tickets += " AND"
        else
            tickets += " WHERE"
        tickets += " p.id_priorite = ?"
        params.push(parseInt(req.query.priority))
    }

    if (req.query.date && ['1j', '2j', '3j', '1s'].includes(req.query.date)) {
        if (where)
            tickets += " AND"
        else
            tickets += " WHERE"

        let number = 1, unit = "j"
        switch (req.query.date) {
            case  '1j':
                number=1
                unit="DAY"
                break
            case "2j":
                number=2
                unit="DAY"
                break
            case "3j":
                number=3
                unit="DAY"
                break
            case '1s':
                number=1
                unit="WEEK"
                break
        }

        tickets += " NOW() <= ADDDATE(t.CREATED_AT, INTERVAL "+  number + " " + unit+")"
    }

    if (req.query.name_user) {
        if (where)
            tickets += " AND"
        else
            tickets += " WHERE"

        tickets += " u.NAME LIKE ?"
        params.push('%' + req.query.name_user.toLowerCase() + '%')
    }

    let priorities = "SELECT * FROM PRIORITE"

    con.query(tickets + ";" + priorities, params,(err, rows) =>
    {
        if (err) throw err;

        let count = false
        if(Object.keys(req.query).length > 0)
            count = rows[0].length

        res.render(__dirname + '/../public/home/operatorManager.ejs', {tickets: rows[0], priorities: rows[1], req: req, count: count})
    });
}

module.exports = ROUTER;