const { User } = require("../../models/allModels");

async function getUser(fastify, options) {
fastify.get(
    "/users",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const existingData = await User.find();

        if (existingData.length > 0) {
          reply.send(existingData);
        } else {
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