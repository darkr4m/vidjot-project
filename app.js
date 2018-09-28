const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Map global promise
mongoose.promise = global.Promise;

//connect to mongoose
const dbUrl = 'mongodb://127.0.0.1:27017/ideas';
mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then(() => {
  console.log(`MongoDB connected at ${dbUrl}.`);
}).catch(err => console.log(err));

//passport config
require('./config/passport')(passport);

//load Models
require('./models/Idea')
const Idea = mongoose.model('ideas');

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method override Middleware
app.use(methodOverride('_method'));

//Express-session Middleware
app.use(session({
  secret:'keyboard cat',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

//global variables
app.use((req,res,next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

//routes
app.use(require('./routes/index'));
app.use(require('./routes/about'));
app.use(require('./routes/users'));
app.use(require('./routes/ideas'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`The server is now running on port ${port}`);
});
