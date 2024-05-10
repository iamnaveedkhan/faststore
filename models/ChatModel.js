const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  retailer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isRequest:{ type:Boolean,default:false},
  status:{ type:Number,default:false},
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    isImage:{ type: Boolean, default: false },
    image: { type: String, default: '' },
  }],
});
const Chat = mongoose.model("Chat", chatSchema);
module.exports = {Chat};
