const { Specification } = require("../../models/allModels");

async function addSpecification(fastify, options) {
  fastify.post("/add-specifications", async (request, reply) => {
    const { name, keyname, keyType, ismandatory, isvariant, isfilter, mainkey } = request.body;
    const specifications = {};

    // Check if arrays are defined and not empty
      // let mandatory= false;
      // let filter= false;
      // let variant= false;
      
      // Loop through each key name
      for (let i = 0; i < keyname.length; i++) {
        specifications[mainkey[keyname[i]]] = {
          type: keyType[i],
          required: ismandatory[i]==="true", // Convert string to boolean
          isFilter: isfilter[i]==="true", // Convert string to boolean
          isVariant: isvariant[i]==="true", // Convert string to boolean
          
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
