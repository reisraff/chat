'use strict';

module.exports.up = function (Schema, mongoose) {
    // Define Room model
    var Room = new Schema({
      name: { type: String, required: true },
      description : { type: String, required: true }
    });

    mongoose.model('Room', Room);
};
