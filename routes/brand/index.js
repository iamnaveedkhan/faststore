async function brands(fastify, options) {
    fastify.register(require("./getBrand.js"));
    fastify.register(require("./postBrand.js"));
  }
  module.exports = brands;
  