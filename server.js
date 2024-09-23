/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session");
// const pool = require('./database/');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const env = require("dotenv").config()
const app = express()
// const utilities = require("./utilities/")
const statics = require("./routes/statics")
 const baseController = require('./controllers/baseController')
// const inventoryRoute = require('./routes/inventoryRoute');
// const accountRoute = require('./routes/accountRoute')
// const mgtRoute = require('./routes/mgtRoute')
// const accountController = require('./controllers/accountController');
// const cookieParser = require("cookie-parser")
// const bodyParser = require('body-parser')

/* ***********************
 * View Engine
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root



/* ***********************
 * Middleware
 * ************************/
// app.use(session({
//   store: new (require('connect-pg-simple')(session))({
//     createTableIfMissing: true,
//     pool,
//   }),
//   secret: process.env.SESSION_SECRET,
//   resave: true,
//   saveUninitialized: true,
//   name: 'sessionId',
// }))


// Express Messages Middleware
// app.use(require('connect-flash')())
// app.use(function(req, res, next){
//   res.locals.messages = require('express-messages')(req, res)
//   next()
// })

// app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies
// app.use(bodyParser.json());

// cookieParser
// app.use(cookieParser());

// app.use(utilities.checkJWTToken)

/* ***********************
 * Routes
 *************************/

app.use(require("./routes/statics"))
//Index Route

app.get("/", function(req, res){
  res.render("index", {titile: "Home"})
})

//app.get("/", baseController.buildHome)
//Inventory routes
//app.use("/inv", inventoryRoute)
//Account routes
//app.use("/account", accountRoute)
//Management Page
//app.use("/mgt", mgtRoute)

//app.post('/signup', accountController.registerAccount);



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`)
})
