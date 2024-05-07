const models = require("../../models/allModels");
const { User, Address } = require("../../models/allModels");
const bcrypt = require("bcrypt");

async function registerUser(fastify, options) {
  fastify.register(require("@fastify/multipart"));

  fastify.post("/register_user", async (request, reply) => {
    try {
      const parts = req.parts();

      let name;
      let mobile;
      let email;
      let role;
      let photo;
      let filePath;
      let isActive;

      let address;
      let city;
      let state;
      let user_id;

      for await (const part of parts) {
        if (part.type === "field" && part.fieldname === "name") {
          name = part.value;
        } else if (part.type === "field" && part.fieldname === "mobile") {
          mobile = part.value;
        } else if (part.type === "field" && part.fieldname === "email") {
          email = part.value;
        } else if (part.type === "field" && part.fieldname === "role") {
          role = part.value;
        } else if (part.type === "field" && part.fieldname === "address") {
          address = part.value;
        } else if (part.type === "field" && part.fieldname === "city") {
          city = part.value;
        } else if (part.type === "field" && part.fieldname === "state") {
          state = part.value;
        } else if (part.type === "field" && part.fieldname === "user_id") {
          user_id = part.value;
        } else if (part.type === "file") {
          photo = part.filename;
          filePath = path.join("public/image/", photo);
          const writableStream = fs.createWriteStream(filePath);
          await part.file.pipe(writableStream);
        }
      }

      const user = new User({
        name,
        mobile,
        email,
        role,
        photo,
      });

      const UserAddres = new Address({
        address,
        city,
        state,
        user_id,
      });

      const savedAddress = await UserAddres.save();
      const savedUser = await user.save();

      const token = fastify.jwt.sign({ userId: savedUser._id });
      var status = "success";

      // const existingUser = await User.findOne({ mobile });

      // if (existingUser) {
      //   return reply.status(409).send({ error: "User already registered" });
      // }

      return reply.send({ savedAddress, savedUser, token, status });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}

module.exports = registerUser;
