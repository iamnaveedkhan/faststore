// routes/chatRoutes.js
const { Chat } = require('../../models/ChatModel');

async function chatRoutes(fastify, options) {
  fastify.get('/chats/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    let retailer, customer;
    const id = request.params.id;
    const userId = request.user.userId;
    if (userId.role == 2) {
      retailer = userId._id;
      customer = id;
      console.log(`retailer    ${retailer}   /n   customer   ${customer}`);
    } else {
      retailer = id;
      customer = userId._id;
    }

    try {

      const chats = await Chat.find({ $and: [{ "retailer": retailer }, { "customer": customer }] }).sort({ "messages.timestamp": 1 });
        for (let i = 0; i < chats.length; i++) {
          const chat = chats[0];
          for (let j = 0; j < chat.messages.length; j++) {
            const message = chat.messages[j];
            if (message.receiver._id == userId._id) {
              message.isRead = true;
              await chat.save(); // Assuming you want to save the chat, not the message
            }
          }
        }
        console.log(chats);
        if(chats.length>0){
          reply.send(chats);
        }else{
          reply.status(501).send(err);
        }
        
      } 
    catch (err) {
      reply.status(500).send(err);
    }
  });

  fastify.post('/addchat', async (request, reply) => {
    try {
      const chat = new Chat(request.body);
      await chat.save();
      // const populatedChat = await chat.populate('sender').populate('receiver').execPopulate();
      reply.send(chat);
    } catch (err) {
      reply.status(500).send(err);
    }
  });
}

module.exports = chatRoutes;
