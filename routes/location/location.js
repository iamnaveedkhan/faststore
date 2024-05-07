
const { User } = require("../../models/allModels");
async function location(fastify, options) {
  fastify.register(require("@fastify/multipart"));
  fastify.post(
    "/savelocation", 
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const parts = req.parts();
        const userid = req.user.userId._id;
        console.log(userid);
        const userData = await User.findById({ _id: userid });

        let latitude;
        let longitude;

        for await (const part of parts) {
          if (part.type === "field" && part.fieldname == "latitude") {
            latitude = part.value;
            // hasFileField = true;
          } else if (part.type === "field" && part.fieldname == "longitude") {
            longitude = part.value;
            // hasNameField = true;
          }
        }

        userData.latitude = latitude;
        userData.longitude = longitude;

        await userData.save();

        return userData;
      } catch (error) {
        console.error("Error adding model:", error);
        reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
}

module.exports = location;
