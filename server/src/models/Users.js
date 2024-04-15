const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedQuestions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = { UserModel };
