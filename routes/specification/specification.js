const { Specification } = require("../../models/allModels");
async function addSpecification(fastify, options) {
  fastify.post("/add-specifications", async (request, reply) => {
    const { name, keyname, keyType, ismandatory, isvariant, isfilter } = request.body;
    const specifications = {};
    for (let i = 0; i < keyname.length; i++) {
      specifications[keyname] = {
        type: keyType,
        required: ismandatory===true,
        isFilter:isfilter===true,
        isVariant:isvariant===true,
      };
    }
    const Spec = new Specification({
      name: name,
      specification:specifications,
    });
    const BrandSaved = await Spec.save();
    return { Spec };
  });
}

module.exports = addSpecification;