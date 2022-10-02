require("dotenv").config(); 
const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require("passport");
const session = require("express-session");
const passport_init = require("./passport/passport_init");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MongoDBStore = require('connect-mongodb-session')(session)


// connect db
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')


let store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use( express.static( "views" ) );


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);


//security packages
const cors = require('cors');
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require('express-rate-limit')

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


// //routers
const authRouter = require('./routes/auth')
const choresRouter = require('./routes/chores')
const childRouter = require('./routes/child')


// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler');


app.set('trust proxy', 1);
app.use(rateLimiter({
  windowsMs: 15 * 60 * 1000, //15 minutes
  max: 100, //limit each IP to 100 requests per  window
}));


app.use(express.json());  
app.use(cors());
app.use(helmet({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data: blob:"],
    },
  })
);
app.use(xss());
app.use(bodyParser());

app.use(express.urlencoded({extended:true}))


//routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/chores',authenticateUser, choresRouter)
app.use('/api/v1/child',authenticateUser ,childRouter)


//app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


// index page
app.get("/", (req, res, next) => {
  res.render('pages/index')
});

//home page
app.get('/home', (req, res, next) => {
  res.render('pages/home')
});


// dashboard
app.get('/dashboard', (req, res, next) => {
  res.render('pages/dashboard')
});


//register form
app.get("/register", (req, res, next) => {
  res.render('pages/register')
});

//home page
app.post('/home', (req, res) => {
  let inputText = [];
  inputText.push(req.body.userInput)
  res.render('pages/home', {
      inputText,
  });
});

//dashboard
app.post('/dashboard', (req, res) => {
  let inputText = [];
  inputText.push(req.body.userInput)
  res.render('pages/dashboard', {
      inputText,
  });
});

//register form
app.post('/register', (req, res) => {
  let inputText = [];
  inputText.push(req.body.userInput)
  res.render('pages/register', {
      inputText,
  });
});



const port = process.env.PORT || 5000;

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();
  