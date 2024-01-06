const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true, // Ensures uniqueness
    required: true, // Makes it a required field
    },
    password: {
      type: String
    },
    email: {
      type: String,
      required: true,
    },
    createdAt : {
      type : Date,
      default : Date.now
    }
});

// Create a model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
