'use strict';

module.exports.up = function (Schema, mongoose) {
    // Define Message model
    var Message = new Schema({
      message: { type: String, required: true },
      roomId: { type: String, required: true },
      userId: { type: String, required: true }
    });

    mongoose.model('Message', Message);
};
