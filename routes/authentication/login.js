
async function loginUser(fastify, options) {
  fastify.get("/login", async (request, reply) => {
    reply.send({ message: "Suceesfulluy Logged in" });
  });
}

module.exports = loginUser;
