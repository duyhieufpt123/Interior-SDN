var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const Role = require('./models/Role');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger');
const cors = require('cors');
require('./middleware/checkAccountStatus')


const roleRouter = require('./routes/roleRoutes');
const accountRouter = require('./routes/accountRoutes');
const productRouter = require('./routes/productRoutes');
const newsRouter = require('./routes/newsRoutes');
const quotationRouter = require('./routes/quotationRoutes');
const blogsRouter = require('./routes/blogRoutes')
const projectRouter = require('./routes/projectRoutes')



var app = express();
app.use(cors());
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());



//Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/accounts', accountRouter);
app.use('/api/products', productRouter);
app.use('/api/news', newsRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/project', projectRouter)

app.use('/api/standard-quotations', quotationRouter);

app.use('/api/role', roleRouter);


//Accept Cors
app.use(cors({credentials: true, origin: "*", exposedHeaders: '*'}));






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
