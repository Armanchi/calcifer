require("dotenv").config(); 
const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
// const passport = require("passport");
const path = require('path');

const viewsPath = path.join(__dirname, '../views/pages') 


//security packages
const cors = require('cors');
const helmet = require("helmet");
// const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require('express-rate-limit')

// passport_init();
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(express.urlencoded({ extended: false }));


// connect db
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')


// //routers
const authRouter = require('./routes/auth')
const choresRouter = require('./routes/chores')


// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowsMs: 15 * 60 * 1000, //15 minutes
  max: 100, //limit each IP to 100 requests per  window
}));



// app.use(express.static("public"));
app.use(express.json());
// app.use(cors());
app.use(helmet());
app.use(xss());
app.use(bodyParser());


//routes
app.use(express.urlencoded({extended:true}))
app.set('view engine', 'ejs');

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/chores',authenticateUser, choresRouter)





// app.use(notFoundMiddleware)
// app.use(errorHandlerMiddleware)


// index page
app.get("/", (req, res, next) => {
  res.render('pages')
});

// login page
app.get('/login', (req, res, next) => {
 res.render('pages')
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
  