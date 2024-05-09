async function specRoutes(fastify, options) {
  fastify.register(require("./postSpecification")),
  fastify.register(require("./Oldspecification"));
}
module.exports = specRoutes;
