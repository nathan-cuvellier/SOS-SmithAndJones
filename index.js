let express = require('express')
let session = require('express-session')
const helmet = require('helmet')
require('dotenv').config()
//let con = require('./db')


let app = express();
app.use(express.static('public'));

app.use(helmet())


app.get('/', function(req, res) {
    res.render(__dirname + '/public/index.ejs');
});

/*********************************/
/*             LOGIN             */
/*********************************/
app.get('/login', (req, res) => {
    res.render(__dirname + '/public/auth/login.ejs');
})

app.post('/login', (req, res) => {
    
})

/*********************************/
/*             LOGIN             */
/*********************************/
app.get('/logout', (req, res) => {
    res.redirect('/')
})

/*********************************/
/*             LOGIN             */
/*********************************/
app.get('/ticket/add', (req, res) => {
    res.render(__dirname + '/public/ticket/add.ejs');
})

app.post('/ticket/add', (req, res) => {
    
})


app.listen(8080);