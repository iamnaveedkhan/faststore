const fastifyRoot = require("fastify");


require("dotenv").config();
const { connect } = require("./db");
const fastify = fastifyRoot({});
const bcrypt = require('bcrypt');
const path = require('node:path');

fastify.register(require('@fastify/cors'), (instance) => {
  return (req, callback) => {
    const corsOptions = {
      // This is NOT recommended for production as it enables reflection exploits
      origin: true
    };

    // do not include CORS headers for requests from localhost
    if (/^localhost$/m.test(req.headers.origin)) {
      corsOptions.origin = false
    }

    // callback expects two parameters: error and options
    callback(null, corsOptions)
  }
})

fastify.register(require("@fastify/view"), {
  engine: {
    ejs: require("ejs"),
  },
});

fastify.register(require('@fastify/jwt'),{
  secret:'naveed',
  cookie: {
    cookieName: 'token',
    signed: false
  }
})

fastify
  .register(require('@fastify/cookie'))

fastify.register(require('@fastify/formbody'))

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/', 
});
// fastify.register(require('fastify-formbody'));
const {User, Product} = require('./models/allModels');

// const Lead = require(model.Lead);
// const Comment = require(model.Comment);
// const Status = require(model.Status);
// const Call = require(model.Call);

fastify.decorate('authenticate', async (req, reply) => {
  try {
    await req.jwtVerify()
    console.log("verification successfull")
  } catch (error) {
    reply.send(error)
    
  }
});

// fastify.get('/', async (request, reply) => {
//   // Your view logic here
//   return { hello: 'world' };
// });

fastify.get('/logedin', { onRequest: [fastify.authenticate] }, async function (req, reply) {
  const userId = req.user.userId;

  return reply.view('/public/logedin.ejs', { userId });
});

fastify.get('/logedout',{onRequest: [fastify.authenticate]}, function (req, reply) {
  const userId = req.user.userId;
  console.log(userId);
  return reply.send("you are loged out") 
})

fastify.get('/newdash', {onRequest: [fastify.authenticate]}, function (req, reply) {
  const userId = req.user.userId;
  return reply.send("dashboard") 
})


// fastify.post('/', async (request, reply) => {
//   const { uname, upass } = request.body;

//   // const token = fastify.jwt.sign({ userId: 'existingUser._id' });
//   const refreshToken = fastify.jwt.sign({ userId: ex },{expiresIn: '10m'});

//   reply.setCookie('refreshToken', refreshToken,{
//     path: '/',
//     secure: true,
//     httpOnly: true,
//     sameSite: true 
//   })

//   return reply.redirect('/logedin');
// });

// fastify.get('/logedin', { onRequest: [fastify.authenticate] }, async function (req, reply) {
//   // Authentication is successful if this route is reached
//   const userId = req.user.userId;

//   return reply.view('/public/logedin.ejs', { userId });
// });

fastify.post('/moblogin', async (request, reply) => {
  const { mob } = request.body;

  if (!mob) {
    return { err: 'Field cannot be empty' };
  }
  console.log(mob);
  try {
   const existingUser = await User.findOne({ $or: [{ mobile: mob }] });

    if (existingUser) {
      


  const token = fastify.jwt.sign({ userId: existingUser })
  reply.send({ token })
     
    } else {
      return reply.status(404).send({ error: "User not found..." });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
});


fastify.register(require("./routes/authentication/index"));
fastify.register(require("./routes/products/index"));

const start = async () => {
    await connect();
    fastify.listen({ port: 3000 , host: '0.0.0.0'}, async (err, address) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
  };
  
  start();
