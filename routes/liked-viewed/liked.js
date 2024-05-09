const { Product, User } = require("../../models/allModels");

async function getLiked(fastify, options) {
  fastify.register(require("@fastify/multipart"));
  fastify.post(
    "/liked/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
        try {
            const { hasLiked } = req.body; // Get hasLiked value from req.body
            console.log("hasLiked:", hasLiked); // Log the value of hasLiked for debugging

            const user = await User.findOne({ _id: req.user.userId._id });
            console.log("User ID:", user.id); // Log the user ID for debugging

            const requestedProductId = req.params.id;
            const product = await Product.findById(requestedProductId);

            if (!product) {
                return reply.send({ error: "Product not found" });
            }

            const index = user.liked.indexOf(requestedProductId);

            if (hasLiked === "true") {
                // If the product is already liked, remove it
                if (index !== -1) {
                    user.liked.splice(index, 1);
                    await user.save();
                    reply.send({ message: "Product unliked successfully" });
                } else {
                    reply.send({ error: "Product is not liked" });
                }
            } else if (hasLiked === "false") {
                // If the product is not already liked, add it
                if (index === -1) {
                    user.liked.push(requestedProductId);
                    await user.save();
                    reply.send({ message: "Product liked successfully" });
                } else {
                    reply.send({ error: "Product is already liked" });
                }
            } else {
                reply.send({ error: "please enter valid input !" });
            }
        } catch (error) {
            console.error(error);
            reply.code(500).send({ error: "Internal server error" });
        }
    }
);


  fastify.get(
    "/get-liked-products",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const user = await User.findOne({ _id: req.user.userId._id });

        const likedProductIds = user.liked;

        const likedProducts = await Product.find({
          _id: { $in: likedProductIds },
        }).populate("user");

        reply.send(likedProducts);
      } catch (error) {
        console.error("Error fetching liked products:", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}

module.exports = getLiked;
