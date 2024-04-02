const { Product, Model, Brand } = require("../../models/allModels");

async function getProduct(fastify, options) {
  fastify.get("/products", async (req, reply) => {
    try {
      const userId = "6604f9313a87c4f151fd06d7";
      const existingData = await Product.find();
        
      if (existingData.length > 0) {
        reply.send(existingData);
      } else {
        console.log("user not found");
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });


  fastify.get("/product/:id", async (req, reply) => {
    try {
      userId = req.params.id;
      const existingData = await Product.find({ _id:userId }).populate({ path: 'photos', model: 'Photo' });
        
      if (existingData.length > 0) {
        reply.send(existingData);
      } else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/allbrands", async (req, reply) => {
    try {
      const existingData = await Brand.find();
        
      if (existingData.length > 0) {
        reply.send(existingData);
      } else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });
}

module.exports = getProduct;
