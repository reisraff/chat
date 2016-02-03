'use strict'

// Dependences
var express = require('express');
var app = express();

var bodyParser = require('body-parser')

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

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
      var response = {
        data : {
          error : 'Invalid Request',
          code : '0002'
        }
      };

      res.status(400).send(response);
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
          password: bcrypt.hashSync(json.user.password)
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

app.post('/api/chat/user/login', function (req, res) {
  try {
    var json = req.body;

    if (! json.user) {
      var response = {
        data : {
          error : 'Invalid Request',
          code : '0002'
        }
      };

      res.status(400).send(response);
    } else {
      var User = mongoose.model('User');

      User.findOne({ 'email': json.user.email }, 'name email password', function (err, user) {
        if (err) {
          return err;
        }

        if (! user) {
          var response = {
            data : {
              error : 'Email Invalid',
              code : '0003'
            }
          };

          return res.status(404).send(response);
        } else {
          if (bcrypt.compareSync(json.user.password, user.password)) {
            var authorizationHash = crypto.createHash('md5').update(new Date().getTime().toString()).digest('hex');

            user.authorization = authorizationHash;
            user.save();

            var response = {
              data : {
                name: user.name,
                email: user.email,
                authorization: authorizationHash
              }
            };

            return res.status(200).send(response);
          } else {
            var response = {
              data : {
                error : 'Wrong Password',
                code : '0004'
              }
            };

            return res.status(404).send(response);
          }
        }

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
