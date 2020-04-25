const { model, Schema } = require('mongoose');

const DialogueSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }]
});


const Dialogue = model('Dialogue', DialogueSchema); 
