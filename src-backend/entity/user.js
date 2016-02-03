'use strict';

module.exports.up = function (Schema, mongoose) {
    // Define User model
    var User = new Schema({
      name: { type: String, required: true },
      email : { type: String, required: true },
      password: { type: String, required: true },
      authorization: String
    });

    mongoose.model('User', User);
};
