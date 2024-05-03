const { Product, User } = require("../../models/allModels");
async function getViewed(fastify, options) {
  fastify.get(
    "/viewed/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const user = await User.findOne({ _id: req.user.userId._id });
        console.log("user id: ", user.id);
        
        let requestedProductId = req.params.id;
        if (user.role == 1) {

          if (!user.viewed.includes(requestedProductId)) {
            const product = await Product.findOneAndUpdate(
              { _id: requestedProductId },
              { $inc: { viewed: 1 } },
              { new: true }
            );

            user.viewed.push(requestedProductId);
            await user.save();
            reply.send(product);
          } else {

            const product = await Product.findOne({ _id: requestedProductId });
            reply.send(product);
          }
        } else {
          reply.send("Unauthorized access");
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
}


module.exports = getViewed;
