const path = require("path");
const fs = require("fs");
const {
  Types: { ObjectId },
} = require("mongoose");

const {
  Product,
  Brand,
  Model,
  Category,
  SubCategory,
  Offers,
  User,
  Inquiry,
  Model2,
  Variant,
  Specification,
} = require("../../models/allModels");
const bcrypt = require("bcrypt");
const { log } = require("console");

async function Upload(fastify, options) {
  fastify.register(require("@fastify/multipart"));

  fastify.post(
    "/offer/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const parts = req.parts();
        let userId = req.params.id;
        let fileName;
        let filePath;

        for await (const part of parts) {
          if (part.type === "file") {
            fileName = part.filename;
            filePath = path.join("public/image/", fileName);
            const writableStream = fs.createWriteStream(filePath);
            await part.file.pipe(writableStream);
          }
        }

        const newOffer = new Offers({
          user: userId,
          photos: `public/image/${fileName}`,
        });

        const OfferSaved = await newOffer.save();
        console.log(OfferSaved);
        return { success: true, message: "offer saved successfully" };
      } catch (error) {
        console.error("Error saving offer:", error);
        return { success: false, message: "Failed to save offer" };
      }
    }
  );

  fastify.post(
    "/product",
    { onRequest: [fastify.authenticate] },
    async function (req, reply) {
      try {
        const parts = req.parts();

        const { name, price, quantity } = req.body;
        const shop = req.user.userId._id;
        // for await (const part of parts) {
        //     if (part.type === 'field') {
        //         if (part.fieldname === 'name') {
        //            name = part.value;
        //         } else if (part.fieldname === 'price') {
        //             price = part.value;
        //         } else if (part.fieldname === 'quantity') {
        //             quantity = part.value;
        //         }
        //     }
        // }
        const existingProduct = await Product.findOne({
          $and: [{ "model._id": name }, { "user._id": shop }],
        });
        if (existingProduct) {
          existingProduct.quantity = quantity;
          existingProduct.price = price;

          await existingProduct.save();

          return { model_id: name, message: "Product updated successfully" };
        }
        // if (existingProduct) {

        //     return reply.status(409).send({ error: "Product Already Added" });
        // }
        else {
          const user_id = await User.findOne({ $or: [{ _id: shop }] });
          const mymodel = await Model.findOne({ _id: name });
          const cate = await Category.findOne({ _id: mymodel.category._id });
          const subcate = await SubCategory.findOne({
            _id: mymodel.subCategory._id,
          });
          const brnd = await Brand.findOne({ _id: mymodel.brand._id });
          const pht = await Photo.findOne({ model: name });
          const prod = new Product({
            model: {
              _id: mymodel._id,
              productName: mymodel.productName,
              photo: mymodel.photo,
              description:
                "this is automated description \n  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            },
            brand: {
              _id: brnd._id,
              brandName: brnd.brandName,
              brandImage: brnd.brandImage,
            },
            user: {
              _id: user_id._id,
              shopNumber: user_id.mobile,
              shopName: user_id.name,
            },
            category: {
              _id: cate._id,
              categoryName: cate.categoryName,
              categoryImage: cate.categoryImage,
            },
            subCategory: {
              _id: subcate._id,
              subCategoryName: subcate.subCategoryName,
              subCategoryImage: subcate.subCategoryImage,
              category: subcate.category,
            },
            photos: pht._id,
            specifications: { keyone: "value1" }, // Allow any key-value pairs
            price: price,
            quantity: quantity,
          });
          const ProdSaved = await prod.save();
        }

        return { model_id: name };
      } catch (error) {
        console.error("Error uploading file:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  fastify.post(
    "/product21",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        // const parts = req.parts();
        const { price, quantity, productId } = req.body;
        console.log(productId, price, quantity);
        const userId = await User.findOne({ _id: req.user.userId._id });

        data = {};
        let savedProduct;
        data["price"] = price;
        data["quantity"] = quantity;
        const product = await Model2.findById({ _id: productId });
        data["product"] = product;

        const existingProduct = await Product.findOne({
          "product._id": productId,
          "user._id": userId,
        });

        console.log(existingProduct);
        if (existingProduct) {
          existingProduct.quantity = quantity;
          existingProduct.price = price;

          await existingProduct.save();

          return existingProduct;
        } else {
          const user = await User.findById(userId);
          if (!user) {
            return reply.code(404).send({ error: "User not found" });
          } else {
            if (user.role == 2) {
              data["user"] = user;
              const newProduct = Product(data);

              savedProduct = await newProduct.save();
            }
          }
          return savedProduct;
        }
      } catch (error) {
        console.error("Error creating product:", error);
        reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );

  fastify.post(
    "/product213",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const { price, quantity, productId } = req.body;
        console.log(productId, price, quantity);
        const userId = req.user.userId._id;

        let savedProduct;

        const existingProduct = await Product.findOne({
          $and: [{ "product._id": productId }, { user: userId }],
        });

        if (existingProduct) {
          return reply.send({ error: "Product Already Exists !" });
        } else {
          const user = await User.findById(userId);

          if (!user) {
            return reply.code(404).send({ error: "User not found" });
          }

          if (user.role !== 2) {
            return reply
              .code(403)
              .send({ error: "User does not have permission" });
          }

          const product = await Model2.findById(productId);

          if (!product) {
            return reply.code(404).send({ error: "Product not found" });
          }

          const newProductData = {
            price: price,
            quantity: quantity,
            product: product,
            user: user,
          };

          const newProduct = Product(newProductData);
          savedProduct = await newProduct.save();
        }

        reply.send(savedProduct);
      } catch (error) {
        console.error("Error creating product:", error);
        reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );

  fastify.get(
    "/enquiry/:id",
    { onRequest: [fastify.authenticate] },
    async function (req, reply) {
      try {
        const productId = req.params.id;
        const userId = await User.findOne({ _id: req.user.userId._id });
        console.log(userId);
        const existingProduct = await Product.findOne({
          _id: productId,
        }).populate("user");
        if (existingProduct) {
          shopName = existingProduct.user._id;
          const product = new Inquiry({
            customer: {
              _id: userId._id,
              customerNumber: userId.mobile,
              customerName: userId.name,
            },
            shop: {
              _id: existingProduct.user._id,
              shopNumber: existingProduct.user.mobile,
              shopName: existingProduct.user.name,
            },
            product: {
              _id: existingProduct._id,
              productName: existingProduct.product.productName,
              photo: existingProduct.product.photo[0],
            },
          });

          await product.save();
        }

        existingProduct.enquired = existingProduct.enquired + 1;
        await existingProduct.save();

        return { shopName: shopName };
      } catch (error) {
        console.error("Error uploading file:", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );

  fastify.post("/addmodel", async (req, reply) => {
    try {
      // Parse form data
      const data = {};
      let fileName;

      for await (const part of req.parts()) {
        if (part.file) {
          // It's a file, save it
          fileName = part.filename;
          const filePath = path.join("public/image/", fileName);
          const writableStream = fs.createWriteStream(filePath);
          await part.file.pipe(writableStream);
          data["photo"] = `public/image/${fileName}`;
        } else {
          // Handle other form fields
          if (part.fieldname.startsWith("variants[]")) {
            del; // It's a variant field
            data[part.fieldname] = part.value;
          } else if (part.fieldname.startsWith("properties.")) {
            // Convert string values to ObjectId
            data[part.fieldname] = part.value;
          } else {
            data[part.fieldname] = part.value;
          }
        }
      }

      // Add variants data to the data object

      // Create a new model instance with the parsed data
      const newModel = new Model2(data);

      // Save the model to the database
      const savedModel = await newModel.save();

      // Respond with the saved model
      return savedModel;
    } catch (error) {
      // Handle errors
      console.error("Error adding model:", error);
      reply.code(500).send({ error: "Internal Server Error" });
    }
  });

  fastify.post(
    "/addproduct",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        // const userId = req.user.userId._id;
        // const user = await User.findById(userId);

        const data = {};
        let photos = [];
        let fileName;

        // if (!user) {
        //     return reply.code(404).send({ error: "User not found" });
        // }

        // data['user']['_id'] = userId._id;
        // data['user']['shopName'] = userId.name;
        // data['user']['shopNumber'] = userId.mobile;

        for await (const part of req.parts()) {
          if (part.file) {
            console.log(part.filename);
            fileName = part.filename;
            const filePath = path.join("public/image/", fileName);
            const writableStream = fs.createWriteStream(filePath);
            await part.file.pipe(writableStream);
            photos.push(`public/image/${fileName}`);
          } else {
            if (part.fieldname.startsWith("specification.")) {
              data[part.fieldname] = part.value;
            } else if (part.fieldname.startsWith("properties.")) {
              // Convert string values to ObjectId
              data[part.fieldname] = part.value;
            } else if (part.fieldname == "type") {
              // Convert string values to ObjectId
              data[part.fieldname] = part.value;
            } else if (part.fieldname == "productName") {
              // Convert string values to ObjectId
              data[part.fieldname] = part.value;
            } else {
              data[part.fieldname] = part.value;
            }
          }
        }
        data["photo"] = photos;
        const newModel = new Model2(data);

        const savedModel = await newModel.save();

        return savedModel;
      } catch (error) {
        console.error("Error adding model:", error);
        reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );

  fastify.post(
    "/addvariant/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const data = {};
        let photos = [];
        let fileName;
        data["groupId"] = req.params.id;
        for await (const part of req.parts()) {
          if (part.file) {
            console.log(part.filename);
            fileName = part.filename;
            const filePath = path.join("public/image/", fileName);
            const writableStream = fs.createWriteStream(filePath);
            await part.file.pipe(writableStream);
            photos.push(`public/image/${fileName}`);
          } else {
            if (part.fieldname.startsWith("specification.")) {
              data[part.fieldname] = part.value;
            } else if (part.fieldname.startsWith("properties.")) {
              // Convert string values to ObjectId
              data[part.fieldname] = part.value;
            } else if (part.fieldname == "type") {
              // Convert string values to ObjectId
              data[part.fieldname] = part.value;
            } else if (part.fieldname == "productName") {
              // Convert string values to ObjectId
              data[part.fieldname] = part.value;
            } else if (part.fieldname === "brandId") {
              data["brand"] = await Brand.findById({ _id: part.value });
            } else {
              data[part.fieldname] = part.value;
            }
          }
        }

        data["photo"] = photos;
        const newModel = new Model2(data);

        const savedModel = await newModel.save();

        return savedModel;
      } catch (error) {
        console.error("Error adding model:", error);
        reply.code(500).send({ error: "Internal Server Error" });
      }
    }
  );
}

module.exports = Upload;
