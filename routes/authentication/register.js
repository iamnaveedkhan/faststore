const models = require("../../models/allModels");
const User = models.User;
const bcrypt = require('bcrypt');

async function registerUser(fastify, options) {
  fastify.post("/register_user", async (request, reply) => {
    try {
      const { mobile , name , role , isActive} = request.body;

      const existingUser = await User.findOne({ mobile });

      if (existingUser) {
        return reply.status(409).send({ error: "User already registered" });
      }

      const user = new User({
        name,
        mobile,
        role,
      });
 
      const savedUser = await user.save();
      console.log(savedUser._id);
      const token = fastify.jwt.sign({ userId: savedUser._id });
      var status = "success";

      return reply.send({ token, status });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}

module.exports = registerUser;