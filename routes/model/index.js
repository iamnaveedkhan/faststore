async function modelRoutes(fastify, options) {
    fastify.register(require("./model"))
  }
module.exports = modelRoutes;