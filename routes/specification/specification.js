const { Specification } = require("../../models/allModels");

async function addSpecification(fastify, options) {
  fastify.post("/add-specifications", async (request, reply) => {
    const { name, keyname, keyType, ismandatory, isvariant, isfilter } = request.body;
    const specifications = {};

    // Check if arrays are defined and not empty
      let mandatory= false;
      let filter= false;
      let variant= false;
      
      // Loop through each key name
      for (let i = 0; i < keyname.length; i++) {
        if(ismandatory[i]==="true"){
          mandatory = true;
        }
        if(isfilter[i]==="true"){
          filter = true;
        }
        if(isvariant[i]==="true"){
          variant = true;
        }
        specifications[keyname[i]] = {
          type: keyType[i],
          required: mandatory, // Convert string to boolean
          isFilter: filter, // Convert string to boolean
          isVariant: variant, // Convert string to boolean
        };
      }
   

    const Spec = new Specification({
      name: "naveed",
      specification: specifications,
    });
    const BrandSaved = await Spec.save();
    return { Spec };
  });
}

module.exports = addSpecification;
