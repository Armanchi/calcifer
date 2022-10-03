require("dotenv").config(); 
const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)

const MongoClient = require('mongodb').MongoClient;

const { authMiddleware, setCurrentUser } = require("./middleware/authentication");



// connect db
const connectDB = require('./db/connect')




let store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
  collection: 'chores'
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

app.use(setCurrentUser);



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


app.post('/home', function(req, res) {
  var children = [
    { name: 'Penelope'},
    { name: 'Amadeo'},
    { name: 'Elena'}
  ];

  res.render('pages/home', {
    children: children,
  });
});


app.get("/chores", function(req,res){
 db.collection('chores')
 .find()
 .toArray(function (err, result)  {
if (err) return console.log(err)
res.render('pages/chores', {chores: result});

});


// app.post("/chores" , function(req,res){
//   db.collection('chores').save(req.body, function(err, result) {
//       if (err) return console.log(err);
//       console.log('saved to database');
//       res.redirect('/');
//     });
  
//       });

// app.get('/chores', (req, res) => {
//   let chores = MongoDBStore.chores;
//   res.render('pages/chores', {
//     chores:chores
//   })

// })

// app.get('/chores', (req, res)=> {
//   res.render('pages/chores')
// })

// app.get('/chores', (req, res) => {
//   MongoClient.connect(process.env.MONGO_URI, { useUnifiedTopology: true }, (err, client) => {
//     if (err) return console.error(err);
//     const db = client.db('chore-app');
//     const collection = db.collection('chores');
//     collection
//       .find()
//       .toArray()
//       .then((results) => {
//         res.render('pages/chores', { chores: results });
//       })
//       .catch((error) => {
//         res.redirect('/');
//       });
//   });
// });




//get chores from mongodb ??????
// app.get('/chores', (req, res) => {
//   store.find().toArray()
//   .then(data => {
//     res.render('chores.ejs', {chores: data})
//   })
//   .catch(err => console.error(error))
// });



//dashboard
// app.post('/dashboard', (req, res) => {
//   let inputText = [];
//   inputText.push(req.body.userInput)
//   res.render('pages/dashboard', {
//       inputText,
//   });
// });

//register form
// app.post('/register', (req, res) => {
//   let inputText = [];
//   inputText.push(req.body.userInput)
//   res.render('pages/register', {
//       inputText,
//   });
// });







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
  