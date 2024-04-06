const {
  Product,
  Model,
  Brand,
  User,
  Category,
  SubCategory,
  Inquiry,
} = require("../../models/allModels");

async function getProduct(fastify, options) {
  fastify.get("/products", async (req, reply) => {
    try {
      const userId = "6604f9313a87c4f151fd06d7";
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

  fastify.get("/product/:id", async (req, reply) => {
    try {
      userId = req.params.id;
      const existingData = await Product.findOne({ _id: userId }).populate({
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

  fastify.get("/brands", async (req, reply) => {
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

  fastify.get("/brand/:id", async (req, reply) => {
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

  fastify.get("/users", async (req, reply) => {
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

  fastify.get("/user/:id", async (req, reply) => {
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

  fastify.get("/categories", async (req, reply) => {
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

  fastify.get("/category/:id", async (req, reply) => {
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

  fastify.get("/subCategories", async (req, reply) => {
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

  fastify.get("/selectedsubcategory/:id", async (req, reply) => {
    try {
      const category = req.params.id;
      const existingData =  await SubCategory.find({
        category: category,
      });

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

  fastify.get("/subCategory/:id", async (req, reply) => {
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

  fastify.get("/models", async (req, reply) => {
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

  fastify.get("/model/:id", async (req, reply) => {
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

  fastify.get("/inquiries", async (req, reply) => {
    try {
      const existingData = await Inquiry.find();

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
}

module.exports = getProduct;
