const {
  Product,
  Model,
  Brand,
  User,
  Category,
  SubCategory,
  Inquiry,
  Product2,
  Model2,
  Specification
} = require("../../models/allModels");

async function getProduct(fastify, options) {

  fastify.get("/products",async (req, reply) => {
    try {
      const existingData = await Product.find();

      if (existingData.length > 0) {
        reply.send(existingData);
      } else {
        console.log("user not found");
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/product/:id",{ onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const userId = req.params.id;
      const existingData = await Product.find({ _id: userId }).populate({
        path: "photos",
        model: "Photo",
      });

      if (existingData) {
        reply.send(existingData);
      } else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });
  

  fastify.get("/productsbycategory/:id",{ onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const subCategoryId = req.params.id;
      const existingData = await Product.find({ "subCategory._id": subCategoryId });

      if (existingData) {
        reply.send(existingData);
      } else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/brands",{ onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const existingData = await Brand.find();

      if (existingData.length > 0) {
        reply.send(existingData);
      } else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/brand/:id",{ onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const brandId = req.params.id;
      const existingBrand = await Brand.findOne({ _id: brandId });
      if (existingBrand) {
        reply.send(existingBrand);
      } else {
        reply.code(404).send({ error: "Brand not found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/users",{ onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const existingData = await User.find();

      if (existingData.length > 0) {
        reply.send(existingData);
      } else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/user/:id",{ onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const userId = req.params.id;
      const existingUser = await User.findOne({ _id: userId });
      if (existingUser) {
        reply.send(existingUser);
      } else {
        reply.code(404).send({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/categories", { onRequest: [fastify.authenticate] },async (req, reply) => {
    try {
      const existingData = await Category.find();

      if (existingData.length > 0) {
        reply.send(existingData);
      } else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/category/:id",{ onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const categoryId = req.params.id;
      const existingCategory = await Category.findOne({ _id: categoryId });
      if (existingCategory) {
        reply.send(existingCategory);
      } else {
        reply.code(404).send({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/subCategories", { onRequest: [fastify.authenticate] },async (req, reply) => {
    try {
      const existingData = await SubCategory.find();

      if (existingData.length > 0) {
        reply.send(existingData);
      } else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/selectedsubcategory/:id",{ onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const category = req.params.id;
      const existingData =  await SubCategory.find({
        category: category,
      });

      if (existingData.length) {
        reply.send(existingData);
      } else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/subCategory/:id",{ onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const subCategoryId = req.params.id;
      const existingSubCategory = await SubCategory.findOne({
        _id: subCategoryId,
      });
      if (existingSubCategory) {
        reply.send(existingSubCategory);
      } else {
        reply.code(404).send({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/models",{ onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const existingData = await Model.find();

      if (existingData.length > 0) {
        reply.send(existingData);
      } else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/modelsbycategory/:id",{ onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const modelId = req.params.id;
      const subcate = await SubCategory.findOne({ _id:modelId })
      const existingData = await Model.find({ subCategory: subcate });

      if (existingData) {
        reply.send(existingData);
      } else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/model/:id",{ onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {
      const modelId = req.params.id;
      const existingModel = await Model.findOne({ _id: modelId });
      if (existingModel) {
        reply.send(existingModel);
      } else {
        reply.code(404).send({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/inquiries",{ onRequest: [fastify.authenticate] }, async function (req, reply) {
    try {
      const userId = await User.findOne({ _id: req.user.userId._id });
      let existingData;
      if (userId.role==1){
        existingData = await Inquiry.find({ "customer._id" : userId._id});
      } else if (userId.role == 2) {
        existingData = await Inquiry.find({ "shop._id" : userId._id});
    } else {
        return reply.code(403).send({ error: "Unauthorized access" });
      }
      if (existingData.length > 0) {
        reply.send(existingData.reverse());
      } else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/inquiry/:id", async (req, reply) => {
    try {
      const inquiryId = req.params.id;
      const existingInquiry = await Inquiry.findOne({ _id: inquiryId });
      if (existingInquiry) {
        reply.send(existingInquiry);
      } else {
        reply.code(404).send({ error: "Inquiry not found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/specification/:id", async (req, reply)=>{
    try {
      const specificationId = req.params.id;;
      const existingSpecifications = await Specification.find({
        $or: [
          { _id: specificationId },
          { category: specificationId }
        ]
      });      if(existingSpecifications.length > 0){
        reply.send(existingSpecifications);
      }else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  })

  fastify.get("/specifications", async (req, reply)=>{
    try {
      const existingSpecifications = await Specification.find();
      if(existingSpecifications.length > 0){
        reply.send(existingSpecifications);
      }else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  })
}


module.exports = getProduct;
