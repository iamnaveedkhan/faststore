async function category(fastify, options) {
  fastify.register(require("./getCategory.js"));
  fastify.register(require("./postCategory.js"));
}
module.exports = category;
