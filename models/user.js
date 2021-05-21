var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true, maxLength: 100},
    username: {type: String, required: true, maxLength: 100},
    email: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 300},
    member_status: {type: Boolean, required: true},
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
  }
);

// Virtual for user's full name
UserSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for user's URL
UserSchema
.virtual('url')
.get(function () {
  return '/:username';
});

//Export model
module.exports = mongoose.model('User', UserSchema);