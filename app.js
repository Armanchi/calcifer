require("dotenv").config(); 
const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)

const { authMiddleware } = require("./middleware/authentication");


//, setCurrentUser
// connect db
const connectDB = require('./db/connect')




let store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'children',
  // collection: 'chores'
});
store.on("error", function (error) {
  console.log(error);
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
const { Child } = require("./models/chores");


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
app.use('/api/v1/chores',authMiddleware, choresRouter)
app.use('/api/v1/child',authMiddleware ,childRouter)

// app.use(setCurrentUser);



//app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// index page
app.get("/", (req, res, next) => {
  res.render('pages/index')
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
  let children = [];
  inputText.push(req.body.userInput)
  children.push(req.body.Child)
  res.render('pages/home', {
      inputText,
      children,
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
  