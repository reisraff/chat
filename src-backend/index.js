'use strict'

// Dependences
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

// Instance for ODM
mongoose.connect('mongodb://localhost/chat');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Require of all entities
require('./entity/user.js').up(Schema, mongoose);


// App configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(function(req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers' : 'Authorization, Origin, X-Requested-With, Content-Type, Accept'
  });
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.status(200).end();
  } else {
    next();
  }
});


// Routing
app.get('/', function (req, res) {
  res.send('Its the API for chat');
});

app.post('/api/chat/user/register', function (req, res) {
  try {
    var json = req.body;

    if (! json.user) {
      res.status(400).end();
    } else {

      var User = mongoose.model('User');

      User.findOne({ 'email': json.user.email }, 'email', function (err, user) {
        if (err) {
          throw err;
          return err;
        }

        if (user) {
          console.log(res.headersSent);
          return res.status(203).end();
        }

        var user = new User({
          name: json.user.name,
          email: json.user.email,
          password: json.user.password
        });

        user.save(function (err) {
          if (err) {
            throw new "Save Failed";
          }
        });

        return res.status(200).end();
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.listen(3002, function () {
  console.log('Example app listening on port 3002!');
});
