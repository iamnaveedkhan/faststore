const { Specification } = require("../../models/allModels");

async function addSpecification(fastify, options) {
  fastify.post("/add-old-specification", async (request, reply) => {
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
          required: ismandatory[i]==="true", 
          isFilter: isfilter[i]==="true", 
          isVariant: isvariant[i]==="true", 
          
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
