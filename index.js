let express = require('express')
let bodyParser = require('body-parser')
let session = require('express-session')
const helmet = require('helmet')
const { check, validationResult } = require('express-validator');

let loginAuthRouter = require('./routes/auth/login');
let addTicketRouter = require('./routes/ticket/CRUD/add');

require('dotenv').config()
let con = require('./db')

// Environment variables
const PORT = process.env.PORT || 8080 ;


let app = express();
app.use(express.static('public'));

app.use(helmet())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.get('/', function (req, res) {
    res.render(__dirname + '/public/index.ejs');
});

/*********************************/
/*             LOGIN             */
/*********************************/
app.use('/login', loginAuthRouter)


/***********************************/
/*              LOGOUT             */
/***********************************/
app.get('/logout', (req, res) => {
    res.redirect('/')
})

/***********************************/
/*              TICKET             */
/***********************************/
app.use('/ticket/add', addTicketRouter)

app.listen(PORT)