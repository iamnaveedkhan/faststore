const { Product, User, Viewed } = require("../../models/allModels");
async function getViewed(fastify, options) {
  fastify.post(
    "/viewed/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const productId = req.params.id;
        const userId = req.user.userId._id;
  
        const userData = await User.findOne({ _id: userId });
        if (!userData) {
          return reply.status(404).send({ error: "User not found" });
        }
  
        let userViewed = await Viewed.findOne({ user: userId });
        if (!userViewed) {
          userViewed = new Viewed({ user: userId, viewed: [] });
        }
  
        if (userData.role === 1) {
          if (!userViewed.viewed.includes(productId)) {
            userViewed.viewed.push(productId);
          }
        } else {
          return reply.status(403).send({ error: "Unauthorized" });
        }
  
        await userViewed.save();
  
        reply.send(userViewed);
  
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
  
}


module.exports = getViewed;
