var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
  {
    title: {type: String, required: true, minLength: 5, maxLength: 100},
    body: {type: String, required: true, minLength: 30, maxLength: 500},
    timestamp: {type: Date, default: Date.now, required: true, },
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true}
  }
);

//Export model
module.exports = mongoose.model('Message', MessageSchema);