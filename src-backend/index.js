'use strict'

// Dependences
var socket = require('socket.io');
var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io = socket.listen(server);
var port = 3002;

var bodyParser = require('body-parser')

var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// App configuration
app.use(express.static(__dirname + '/bower_components'));
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

// Instance for ODM
mongoose.connect('mongodb://localhost/chat');

// Require of all entities
require('./entity/user.js').up(Schema, mongoose);
require('./entity/room.js').up(Schema, mongoose);

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

app.post('/api/chat/room', function (req, res) {
  try {
    if (! req.headers['authorization']) {
      res.status(403).send();
    } else {
      var User = mongoose.model('User');
      User.findOne({ 'authorization': req.headers['authorization'].trim() }, 'name', function (err, user) {
        if (err) {
          return err;
        }

        if (! user) {
          return res.status(403).send();
        }

        var json = req.body;

        if (! json.room) {
          var response = {
            data : {
              error : 'Invalid Request',
              code : '0002'
            }
          };

          res.status(400).send(response);
        } else {
          var Room = mongoose.model('Room');

          Room.findOne({ 'name': json.room.name }, 'name', function (err, room) {
            if (err) {
              return err;
            }

            if (room) {
              var response = {
                data : {
                  error : 'Room already exists',
                  code : '0005' // check
                }
              };

              return res.status(400).send(response);
            }

            var room = new Room({
              name: json.room.name,
              description: json.room.description
            });

            room.save(function (err) {
              if (err) {
                throw new "Save Failed";
              }
            });

            return res.status(200).end();
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

app.get('/api/chat/room', function (req, res) {
  try {
    if (! req.headers['authorization']) {
      res.status(403).send();
    } else {
      var User = mongoose.model('User');
      User.findOne({ 'authorization': req.headers['authorization'].trim() }, 'name', function (err, user) {
        if (err) {
          return err;
        }

        if (! user) {
          return res.status(403).send();
        }

        var Room = mongoose.model('Room');

        Room.find({}, 'name description', function (err, rooms) {
          if (err) {
            return err;
          }

          var response = {
            data : rooms
          };

          return res.status(200).send(response);
        });
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

// socket
io.on('connection', function (socket) {

});

server.listen(port, function () {
  console.log('Example app listening on port ' + port);
});
