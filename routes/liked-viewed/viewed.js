const { Product, User, Viewed } = require("../../models/allModels");
async function getViewed(fastify, options) {

    // -----------post route---------------

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
            if (userViewed.viewed.length >= 5) {
              userViewed.viewed.shift();
            }
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


  // -----------get route---------------

  
  fastify.get(
    "/get-viewed-products",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const userId = req.user.userId._id;
        
        const user = await Viewed.findOne({ user: userId });
   
        const viewedProductIds = user.viewed;
        const viewedProducts = await Product.find({
          _id: { $in: viewedProductIds },
        }).populate("user");

        reply.send(viewedProducts);
      } catch (error) {
        console.error("Error fetching liked products:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
  
  
  
}


module.exports = getViewed;
