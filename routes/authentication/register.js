const path = require("path");
const fs = require("fs");
const models = require("../../models/allModels");
const { User, Address } = require("../../models/allModels");
const bcrypt = require("bcrypt");

async function registerUser(fastify, options) {
  fastify.register(require("@fastify/multipart"));

  fastify.post("/register", async (req, reply) => {
    try {
      const data = req.body;
    
      const user = new User(data);
      const savedUser = await user.save();
      data['user_id']=savedUser._id;
      const UserAddres = new Address(data);
      const savedAddress = await UserAddres.save();
      const token = fastify.jwt.sign({ userId: savedUser });
      var status = "success";

      return reply.send({ savedAddress, savedUser, token, status });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}

module.exports = registerUser;

















// fastify.post("/register", async (req, reply) => {
//   try {
//     const parts = req.parts();
    
//     let fileName;
//     let filePath;
    
//     let data = [];

//     for await (const part of parts) {
//       if (part.type === "field") {
//         data[part.fieldname] = part.value;
//       } else if (part.type === "file") {
//         fileName = part.filename;
//         filePath = path.join("public/image/", fileName);
//         const writableStream = fs.createWriteStream(filePath);
//         await part.file.pipe(writableStream);
//         data['photo'] = `public/image/${fileName}`
//       }
//     }

    
//     const user = new User(data);
//     const savedUser = await user.save();
//     data['user_id']=savedUser._id;
//     const UserAddres = new Address(data);
//     const savedAddress = await UserAddres.save();
//     const token = fastify.jwt.sign({ userId: savedUser });
//     var status = "success";


//     return reply.send({ savedAddress, savedUser, token, status });
//   } catch (error) {
//     console.error(error);
//     reply.status(500).send({ error: "Internal Server Error" });
//   }
// });
