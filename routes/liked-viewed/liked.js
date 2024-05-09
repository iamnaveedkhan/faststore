const { Product, User } = require("../../models/allModels");

async function getLiked(fastify, options) {
  fastify.register(require("@fastify/multipart"));
  fastify.post(
    "/liked/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
        try {
            const parts = req.parts();
            let hasLiked;

            for await (const part of parts) {
                if (part.type === "field") {
                    hasLiked = part.value;
                }
            }

            console.log("hasLiked:", hasLiked); // Log the value of hasLiked for debugging

            if (hasLiked === "true") {
                reply.send({ error: "already liked " });
            } else if (hasLiked === "false") {
                const user = await User.findOne({ _id: req.user.userId._id });
                console.log("User ID:", user.id); // Log the user ID for debugging

                const requestedProductId = req.params.id;
                if (user) {
                    const product = await Product.findOneAndUpdate(
                        { _id: requestedProductId },
                        { $inc: { liked: 1 } },
                        { new: true }
                    );

                    user.liked.push(requestedProductId);
                    await user.save();

                    reply.send(product);
                } else {
                    reply.send("something went wrong !");
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
            
            const likedProducts = await Product.find({ _id: { $in: likedProductIds } }).populate('user');

            reply.send(likedProducts );
        } catch (error) {
            console.error("Error fetching liked products:", error);
            reply.status(500).send({ error: "Internal Server Error" });
        }
    }
);

}

module.exports = getLiked;
