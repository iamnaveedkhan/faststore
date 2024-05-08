async function subcategory(fastify, options) {
    fastify.register(require("./getSubcategory"))
    fastify.register(require("./postSubcategory"))
  }
module.exports = subcategory;