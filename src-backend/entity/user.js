'use strict';

module.exports.up = function (Schema, mongoose) {
    // Define User model
    var User = new Schema({
      name: String,
      email : String,
      password: String,
      authorization: String
    });

    mongoose.model('User', User);
};
