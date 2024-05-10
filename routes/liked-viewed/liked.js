const { User, Product, Liked } = require("../../models/allModels");

async function getLiked(fastify, options) {
  fastify.post(
    "/liked/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const { hasLiked } = req.body;
        console.log("hasLiked:", hasLiked);

        const userId = req.user.userId._id;

        let user = await Liked.findOne({ user: userId });
        if (!user) {
          user = new Liked({ user: userId, liked: [] });
        }

        const requestedProductId = req.params.id;
        const product = await Product.findById(requestedProductId);

        if (!product) {
          return reply.send({ error: "Product not found" });
        }

        const index = user.liked.indexOf(requestedProductId);

        if (hasLiked === "true") {
          if (index !== -1) {
            user.liked.splice(index, 1);
            await user.save();
            reply.send({ message: "Product unliked successfully" });
          } else {
            reply.send({ error: "Product is not liked" });
          }
        } else if (hasLiked === "false") {
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
        const userId = req.user.userId._id;
        console.log(userId);

        const user = await Liked.findOne({ user: userId });

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

  fastify.get(
    "/liked-or-not/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const userId = req.user.userId._id;
        const productId = req.params.id;

        const userLikedData = await Liked.findOne({ user: userId });
        if (!userLikedData) {
          return reply
            .status(404)
            .send({ error: "Liked data not found for the user" });
        }

        const likedOrNot = userLikedData.liked.includes(productId);

        reply.send(likedOrNot);
      } catch (error) {
        console.error("Error fetching liked-or-not : ", error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}

module.exports = getLiked;
