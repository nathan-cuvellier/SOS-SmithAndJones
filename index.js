let express = require('express')
let bodyParser = require('body-parser')
let session = require('express-session')
const helmet = require('helmet')
const { check, validationResult } = require('express-validator');
require('dotenv').config()
let homeRouter = require('./routes/home')
let loginAuthRouter = require('./routes/auth/login');
let addTicketRouter = require('./routes/ticket/CRUD/create');
let readTicketRouter = require('./routes/ticket/CRUD/read')
let RPGDRouter = require('./routes/RGPD/RGPD')
let con = require('./db')
const SESSION = require('express-session');

// Environment variables
const PORT = process.env.PORT || 8080 ;


let app = express();
app.use(express.static('public'));

app.use(helmet())

app.set('trust proxy', 1);
app.use(SESSION({
	secret: SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	cookie: { secure: PRODUCTION_MODE, maxAge: DISCORD_EXPIRATION_TOKEN_MS}
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())



app.use('/', homeRouter)

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
app.use('/ticket/create', addTicketRouter)

app.use('/ticket/read/:id',readTicketRouter)

/***********************************/
/*               RGPD              */
/***********************************/
app.use('/RGPD', RPGDRouter)

app.listen(PORT)