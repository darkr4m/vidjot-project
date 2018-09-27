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

//index route
app.get('/', (req,res) => {
  const title = "welcome";
  res.render('index', {
    title: title
  });
});

//about route
app.get('/about', (req,res) => {
  res.render('about');
});

//idea index page
app.get('/ideas', (req,res) => {
  Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

//add idea form
app.get('/ideas/add', (req,res) => {
  res.render('ideas/add');
});

//edit idea form
app.get('/ideas/edit/:id', (req,res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea:idea
    });
  })
});

//Process form
app.post('/ideas', (req,res) => {
  let errors = [];
  if(!req.body.title){
    errors.push({ text: 'Please add a title.' })
  }
  if(!req.body.details){
    errors.push({ text: 'Please describe your idea.' })
  }
  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas');
      })
  }
});

//edit form Process
app.put('/ideas/:id', (req,res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    //new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
    .then(idea => {
      res.redirect('/ideas');
    })
  })
});

//delete idea
app.delete('/ideas/:id', (req,res) => {
  Idea.remove({ _id: req.params.id})
  .then(() => {
    res.redirect('/ideas');
  })
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`The server is now running on port ${port}`);
});
