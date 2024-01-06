const mongoose = require('mongoose');

// Define the user schema
const NotePadSchema = new mongoose.Schema({
      title: {
        type: String
      },
      content: {
        type: String,
      },
      sharedWith : [String],
      createdAt : {
        type : Date,
        default : Date.now
      },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required : true} // Reference to User model
  });

  // Creating indexes on 'content' and 'title'
  NotePadSchema.index({ content: 'text', title: 'text' });
  
  // Create a model based on the schema
  const NotePad = mongoose.model('NotePad', NotePadSchema);
  
  module.exports = NotePad;