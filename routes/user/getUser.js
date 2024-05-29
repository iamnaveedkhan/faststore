const {Address, User } = require("../../models/allModels");

async function getUser(fastify, options) {
  fastify.register(require("@fastify/multipart"));
  fastify.get(
    "/users/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const role = req.params.id;
        let existingData; 
            
        if (role == 1) {
          existingData = await User.find({role : 1,isActive : true});
          return existingData
        } else if (role == 2 ) {
          existingData = await Address.find().populate('user');
          return existingData
        }
        else {
          reply.code(404).send({ error: "No data found" });
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/user/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const userId = req.params.id;
        const existingUser = await User.find({ _id: userId });
        if (existingUser) {
          reply.send(existingUser);
        } else {
          reply.code(404).send({ error: "User not found" });
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
}

module.exports = getUser;
