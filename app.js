require("dotenv").config(); 
const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');



//security packages
const rateLimiter = require('express-rate-limit')
app.use(cors());

//connect db
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')


//routers
const indexRouter = require('./routes/index')
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

//extra packages 
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(bodyParser());



//routes
app.set('views', 'views')
app.set('view engine', 'ejs')
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/auth/chores', choresRouter)

app.use('/', indexRouter)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


 

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
  