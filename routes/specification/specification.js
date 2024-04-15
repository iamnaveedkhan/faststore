const { Specification } = require("../../models/allModels");

async function addSpecification(fastify, options) {
  fastify.post("/add-specifications", async (request, reply) => {
    const { name, keyname, keyType, ismandatory, isvariant, isfilter } = request.body;
    const specifications = {};

    // Loop through each key name
    for (let i = 0; i < keyname.length; i++) {
      
      specifications[keyname[i]] = {
        type: keyType[i],
        required: ismandatory[i], // Convert string to boolean
        isFilter: isfilter[i], // Convert string to boolean
        isVariant: isvariant[i], // Convert string to boolean
      };
    }

    const Spec = new Specification({
      name: name,
      specification: specifications,
    });
    const BrandSaved = await Spec.save();
    return { Spec };
  });
}

module.exports = addSpecification;
