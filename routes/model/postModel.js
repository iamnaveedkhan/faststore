const { Model2 } = require("../../models/allModels");

async function addSpecification(fastify, options) {
  fastify.register(require("@fastify/multipart"));

  fastify.post("/add-models", async (request, reply) => {
    try {
      const { productName, type, properties, photo, specification } =
        request.body;

      const { category, subcategory, vertical } = properties;

      const model = new Model2({
        type,
        productName,
        properties: { category, subcategory, vertical },
        photo,
        specification,
      });

      const savedModel = await model.save();
      reply.code(201).send(savedModel);
    } catch (error) {
      console.error("Error saving model:", error);
      reply.code(500).send({ error: "Internal Server Error" });
    }
  });
}

module.exports = addSpecification;
