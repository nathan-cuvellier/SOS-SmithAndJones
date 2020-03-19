const EXPRESS = require('express');
const ROUTER = EXPRESS.Router();

ROUTER.get('/', (req, res) => {
    res.redirect('/')
})

module.exports = ROUTER;

