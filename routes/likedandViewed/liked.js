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

        if(hasLiked == "true"){
          reply.send({error : "already liked "});
        }

        else if (hasLiked == "false") {
          const user = await User.findOne({ _id: req.user.userId._id });
          console.log(user.id);

          let requestedProductId = req.params.id;
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
        }
        else{
          reply.send({error : "please enter valid input !"});
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
}

module.exports = getLiked;
