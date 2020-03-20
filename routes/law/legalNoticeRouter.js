const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

ROUTER.get('/', (req, res) => {
    res.render(__dirname + '/../../public/law/legalNotice.ejs');
})

module.exports = ROUTER;