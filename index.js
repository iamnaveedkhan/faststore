const fastifyRoot = require("fastify");

require("dotenv").config();
const { connect } = require("./db");
const fastify = fastifyRoot({logger:true});
const bcrypt = require("bcrypt");
const path = require("node:path");

fastify.register(require("@fastify/cors"), (instance) => {
  return (req, callback) => {
    const corsOptions = {
      origin: true,
    };

    if (/^localhost$/m.test(req.headers.origin)) {
      corsOptions.origin = false;
    }

    callback(null, corsOptions);
  };
});



fastify.register(require("@fastify/view"), {
  engine: {
    ejs: require("ejs"),
  },
});

fastify.register(require("@fastify/jwt"), {
  secret: "naveed",
  cookie: {
    cookieName: "token",
    signed: false,
  },
});

fastify.register(require("@fastify/cookie"));

fastify.register(require("@fastify/formbody"));

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/public/",
});

const { User, Product, Brand, Category, Product2 } = require("./models/allModels");

fastify.decorate("authenticate", async (req, reply) => {
  try {
    await req.jwtVerify();
    console.log("verification successfull");
  } catch (error) {
    reply.send(error);
  }
});

fastify.get('/search/:key', async (req, reply) => {
  try {
    const key = req.params.key;
    const searchRegex = new RegExp(key, 'i'); 

    const data = await Product2.aggregate([
      {
        $match: {
          $or: [
            // { "brand.brandName": { $regex: searchRegex } },
            { "product.productName": { $regex: searchRegex } },
            { "product.type": { $regex: searchRegex } },
            { "user.name": { $regex: searchRegex } }
          ]
        }
      }
    ]);
    reply.send(data);
  } catch (error) {
    console.error('Error during search:', error);
    reply.status(500).send({ error: 'Internal Server Error' });
  }
});

fastify.get(
  "/logedin",
  { onRequest: [fastify.authenticate] }, async function (req, reply) {
    const userId = req.user.userId;

    return reply.view("/public/logedin.ejs", { userId });
  }
);

fastify.get(
  "/logedout",
  { onRequest: [fastify.authenticate] },
  function (req, reply) {
    const userId = req.user.userId;
    console.log(userId);
    return reply.send("you are loged out");
  }
);

fastify.get(
  "/newdash",
  { onRequest: [fastify.authenticate] },
  function (req, reply) {
    const userId = req.user.userId;
    return reply.send("dashboard");
  }
);

fastify.register(require("./routes/authentication/index"));
fastify.register(require("./routes/products/index"));
fastify.register(require("./routes/update/index"));
fastify.register(require("./routes/specification/index"));

const start = async () => {
  await connect();
  fastify.listen({ port: 3000, host: "0.0.0.0" }, async (err, address) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
};

start();
