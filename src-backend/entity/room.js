'use strict';

module.exports.up = function (Schema, mongoose) {
    // Define Room model
    var Room = new Schema({
      name: String,
      description : String
    });

    mongoose.model('Room', Room);
};
