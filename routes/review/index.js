async function review(fastify, options) {
    fastify.register(require("./postReview.js"));
  }
  module.exports = review;
  