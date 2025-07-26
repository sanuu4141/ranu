const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Plain text (for demo only)
  email: { type: String, required: true },
  contactNo: { type: Number, required: true }
});

module.exports = mongoose.model('User', userSchema);
