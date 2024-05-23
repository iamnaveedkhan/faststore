const { Model2 } = require("../../models/allModels");

async function getDashboardData(fastify, options) {
  fastify.get(
    "/total-active-models",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        
        const activeProductsCount = await Model2.countDocuments({ isActive: true });
        return activeProductsCount;

      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
}

module.exports = getDashboardData;
