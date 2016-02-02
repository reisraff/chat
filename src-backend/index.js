'use strict'

// Dependences
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Instance for ODM
mongoose.connect('mongodb://localhost/chat');

// Require of all entities
require('./entity/user.js').up(Schema, mongoose);

// App configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(function(req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,X-TOKEN,X-User-Agent,X-Locale,Authorization'
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
          return err;
        }

        if (user) {
          var response = {
            data : {
              error : 'User already registered',
              code : '0001'
            }
          };

          return res.status(400).send(response);
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
