// const { Specification } = require("../../models/allModels");

// async function addSpecification(fastify, options) {
//   fastify.post("/add-s", async (request, reply) => {
    
//     const Spec = new Specification({
//       specification: 

//     });

//     try {
//       // Save the Specification object to the database
//       const savedSpec = await Spec.save();
//       // Return the saved Specification object in the response
//       return reply.code(201).send({ success: true, spec: savedSpec });
//     } catch (error) {
//       // If an error occurs during saving, return an error response
//       return reply.code(500).send({ success: false, error: error.message });
//     }
//   });
// }

// module.exports = addSpecification;
