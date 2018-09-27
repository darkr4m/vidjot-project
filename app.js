const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

//Map global promise
mongoose.promise = global.Promise;

//connect to mongoose
const dbUrl = 'mongodb://127.0.0.1:27017/ideas';
mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then(() => {
  console.log(`MongoDB connected at ${dbUrl}.`);
}).catch(err => console.log(err));

//load Models
require('./models/Idea')
const Idea = mongoose.model('ideas');

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//method override Middleware
app.use(methodOverride('_method'));

//routes
app.use(require('./routes/index'));
app.use(require('./routes/about'));
app.use(require('./routes/ideasRoutes/index'));
app.use(require('./routes/ideasRoutes/add'));
app.use(require('./routes/ideasRoutes/edit'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`The server is now running on port ${port}`);
});
