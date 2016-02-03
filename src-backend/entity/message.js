'use strict';

module.exports.up = function (Schema, mongoose) {
    // Define Message model
    var Message = new Schema({
      message: String,
      roomId: String,
      userId: String
    });

    mongoose.model('Message', Message);
};
