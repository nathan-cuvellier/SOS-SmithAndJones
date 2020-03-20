let express = require('express')
let bodyParser = require('body-parser')
let session = require('express-session')
let fileUpload  = require('express-fileupload')
const helmet = require('helmet')
const { check, validationResult } = require('express-validator');
require('dotenv').config()
let homeRouter = require('./routes/index')
let loginAuthRouter = require('./routes/auth/login');
let logoutAuthRouter = require('./routes/auth/logout');
let addTicketRouter = require('./routes/ticket/CRUD/create');
let readTicketRouter = require('./routes/ticket/CRUD/read')
let closeTicketRouter = require('./routes/ticket/close')
let legalNoticeRouter = require('./routes/law/legalNoticeRouter')
let con = require('./db')
const SESSION = require('express-session');

// Environment variables
const PORT = process.env.PORT || 8080;


let app = express();
app.use(express.static('public'));
app.use('/attachment', express.static('attachment'));


app.use(helmet())

app.set('trust proxy', 1);
app.use(SESSION({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	cookie: { secure: process.env.PRODUCTION_MODE, maxAge: Number(process.env.DISCORD_EXPIRATION_TOKEN_MS)}
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(fileUpload({
	limits: { fileSize: 5 * 1024 * 1024 },
}));

app.use('/', homeRouter)

/*********************************/
/*             LOGIN             */
/*********************************/
app.use('/login', loginAuthRouter)


/***********************************/
/*              LOGOUT             */
/***********************************/
app.use('/logout', logoutAuthRouter)

/***********************************/
/*              TICKET             */
/***********************************/
app.use('/ticket/create', addTicketRouter)
app.use('/ticket/read/', readTicketRouter)
app.use('/ticket/close/', closeTicketRouter)

/***********************************/
/*               LAW               */
/***********************************/
app.use('/law/legal-notice', legalNoticeRouter)


app.listen(PORT)