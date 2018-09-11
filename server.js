var express = require('express');
var app = express(); // create our app with express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console (express 4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express 4)
var methodOverride = require('method-override'); // simulate DELETE and PUT

/* ==== CONFIGURATION ==== */
mongoose.connect('mongodb://localhost:27017/dhea');

app.use(express.static(__dirname + '/public')); // state the static files location
app.use(morgan('dev')); // log every requests to the console
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());

app.listen(8080);
console.log("App listening on port 8080");

// define model
var Todo = mongoose.model('Todo', {
  text: String
});

// routes
app.get('/api/todos', function(req,res){
  Todo.find(function(err, todos){
    if (err)
      res.send(err);
    res.json(todos);
  });
});

app.post('/api/todos', function(req,res){
  Todo.create({
    text: req.body.text,
    done: false
  }, function(err, todo){
    if(err){
      res.send(err);
    }

    // get and return all the todos after you create another
    Todo.find(function(err,todos){
      if (err){
        res.send(err);
      }
      res.json(todos);
    });
  });
});

app.delete('/api/todos/:todo_id', function(req, res){
  Todo.remove({
    _id: req.param.todo_id
  }, function(err, todo){
    if (err){
      res.send(err);
    }

    Todo.find(function(err, todos){
      if(err){
        res.send(err);
      }
      res.json(todos);
    });
  });
});


// application
app.get('*', function(req, res){
  res.sendFile('./public/index.html');
});
