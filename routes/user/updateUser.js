const path = require("path");
const fs = require("fs");
const { User } = require("../../models/allModels");

async function updateUser(fastify, options) {
  fastify.register(require("@fastify/multipart"));
  fastify.post(
    "/update-user",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const userid = req.user.userId._id;
        const parts = req.parts();

        let userData = await User.findById({ _id: userid });

        let newName, fileName, filePath;
        let data = {};

        for await (const part of parts) {
          if (userData.role == 1) {
            if (part.type === "field" && part.fieldname == "name") {
              newName = part.value.trim();
              userData.name = newName;
            }
          } else if (userData.role == 2) {
            if (part.type === "field") {
              data[part.fieldname] = part.value;
            } else if (part.type === "file") {
              fileName = part.filename;
              filePath = path.join("public/image/", fileName);
              const writableStream = fs.createWriteStream(filePath);
              await part.file.pipe(writableStream);
              data["photo"] = `public/image/${fileName}`;
            }
          }
        }

        // Update userData with data
        if (userData.role == 2) {
          Object.assign(userData, data);
        }

        await userData.save();

        return userData;
      } catch (error) {
        console.error("Error processing request:", error);
        reply.status(500).send("Internal Server Error");
      }
    }
  );
}

module.exports = updateUser;
