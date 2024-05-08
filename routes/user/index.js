async function user(fastify, options) {
    fastify.register(require("./getUser"))
  }
module.exports = user;