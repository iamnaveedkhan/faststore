const {
  Chat,
  Product,
  Model,
  Brand,
  User,
  Category,
  SubCategory,
  Inquiry,
  Model2,
  Specification,
  Offers,
} = require("../../models/allModels");

async function getProduct(fastify, options) {
  fastify.register(require("@fastify/multipart"));
  fastify.get("/products", async (req, reply) => {
    try {
      const existingData = await Product.find().populate("user");

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

  fastify.get("/productalldetails", async (req, reply) => {
    try {
      const existingData = await Product.find().populate("user");

      if (existingData.length > 0) {
        console.log(existingData);
        reply.send(existingData);
      } else {
        reply.code(404).send({ error: "No data found" });
      }
    } catch (error) {
      console.error(error);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get(
    "/product/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const userId = req.params.id;
        let existingData;
        if (userId.length > 10) {
          existingData = await Product.find({ _id: userId }).populate("user");
        } else {
          existingData = await Product.find({
            "product.groupId": userId,
          }).populate("user");
        }

        if (existingData.length > 0) {
          reply.send(existingData);
        } else {
          reply.code(404).send({ error: "No data found" });
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/productsbysubcategory/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const subCategoryId = req.params.id;
        const existingData = await Product.find({
          "product.properties.subcategory": subCategoryId,
        }).populate("user");

        if (existingData) {
          reply.send(existingData);
        } else {
          reply.code(404).send({ error: "No data found" });
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/productsbycategory/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const categoryId = req.params.id;
        const existingData = await Model2.find({
          "properties.category": categoryId,
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
    }
  );

  fastify.get(
    "/productsbyvertical/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const verticalId = req.params.id;
        console.log(verticalId);
        const existingData = await Model2.find({
          "properties.vertical": verticalId,
        });
        console.log("aaaaaaaaa:", existingData);
        if (existingData) {
          reply.send(existingData);
        } else {
          reply.code(404).send({ error: "No data found" });
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/selectedsubcategory/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const category = req.params.id;
        const existingData = await SubCategory.find({
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
    }
  );

  fastify.get(
    "/subCategory/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
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
    }
  );

  fastify.get(
    "/models",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const existingData = await Model2.find();
        console.log(existingData.length);
        if (existingData.length > 0) {
          reply.send(existingData);
        } else {
          reply.code(404).send({ error: "No data found" });
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/model/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const modelId = req.params.id;
        let existingModel;

        if (modelId.length > 10) {
          existingModel = await Model2.find({ _id: modelId });
        } else {
          console.log(modelId);
          existingModel = await Model2.find({
            groupId: modelId,
          });
        }

        if (existingModel.length > 0) {
          console.log(existingModel);
          reply.send(existingModel);
        } else {
          reply.code(404).send({ error: "No data found" });
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/modelsbycategory/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const modelId = req.params.id;
        // const subcate = await SubCategory.findOne({ _id: modelId });
        const existingData = await Model2.find({
          "properties.subcategory": modelId,
        });
        console.log(existingData);
        if (existingData) {
          reply.send(existingData);
        } else {
          reply.code(404).send({ error: "No data found" });
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/inquiries",
    { onRequest: [fastify.authenticate] },
    async function (req, reply) {
      try {
        const userId = await User.findOne({ _id: req.user.userId._id });
        console.log(req.user.userId._id);
        let existingData;
        if (userId.role == 1) {
          existingData = await Inquiry.find({ "customer._id": userId._id });
        } else if (userId.role == 2) {
          existingData = await Inquiry.find({ "shop._id": userId._id });
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
    }
  );

  fastify.get(
    "/allinquiries",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        console.log("ffffffffffffffffffff");
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;

        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);

        endDateTime.setDate(endDateTime.getDate() + 1);

        const existingData = await Inquiry.find({
          date: {
            $gte: startDateTime,
            $lt: endDateTime,
          },
        });

        if (existingData.length > 0) {
          reply.send(existingData);
          console.log("ffffffffffffffffffff", existingData.length);
        } else {
          reply.code(404).send({ error: "No data found" });
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/inquiry/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
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
    }
  );

  fastify.get(
    "/specification/:id",
    // { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const specificationId = req.params.id;
        const existingSpecifications = await Specification.find({
          $or: [{ _id: specificationId }, { category: specificationId }],
        });
        if (existingSpecifications.length > 0) {
          reply.send(existingSpecifications);
        } else {
          reply.code(404).send({ error: "No data found" });
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/specifications",

    async (req, reply) => {
      try {
        const existingSpecifications = await Specification.find();
        if (existingSpecifications.length > 0) {
          reply.send(existingSpecifications);
        } else {
          reply.code(404).send({ error: "No data found" });
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/activeCustomerandRetailerList/:role",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const role = req.params.role;
        const existingData = await User.find({
          $and: [{ role: role }, { isActive: 1 }],
        });
        if (existingData.length > 0) {
          return existingData;
        } else {
          return "no data found";
        }
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/chat",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      let existingData;
      const userid = req.user.userId._id;
      const user = await User.findById({ _id: userid });

      if (user.role == 1) {
        existingData = await Chat.find({ customer: userid });
      } else if (user.role == 2) {
        existingData = await Chat.find({ retailer: userid });
      }
      reply.send(existingData);
    }
  );

  
  fastify.get(
    "/nearbyAndOffers",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const EARTH_RADIUS_KM = 6371;
        const maxDistance = 5;
        const userid = req.user.userId._id;
        console.log('');
  
        const user = await User.findById(userid);
  
        const userLatitude = parseFloat(user.latitude);
        const userLongitude = parseFloat(user.longitude);
  
        const deltaLatitude = (maxDistance / EARTH_RADIUS_KM) * (180 / Math.PI);
        const deltaLongitude = ((maxDistance / EARTH_RADIUS_KM) * (180 / Math.PI)) / Math.cos((userLatitude * Math.PI) / 180);
  
        // Calculate latitude and longitude ranges
        const minLatitude = userLatitude - deltaLatitude;
        const maxLatitude = userLatitude + deltaLatitude;
        const minLongitude = userLongitude - deltaLongitude;
        const maxLongitude = userLongitude + deltaLongitude;
  
        console.log("Latitude Range:", minLatitude, "-", maxLatitude);
        console.log("Longitude Range:", minLongitude, "-", maxLongitude);
  
        // Find users within the calculated ranges
        const nearbyUsers = await User.find({
          latitude: { $gte: minLatitude, $lte: maxLatitude },
          longitude: { $gte: minLongitude, $lte: maxLongitude },
          role:2
        });
  
        // Find products and offers associated with nearby users
        const filteredProducts = await Product.find({ user: { $in: nearbyUsers } }).populate("user");
        const activeOffers = await Offers.find({ user: { $in: nearbyUsers }, isActive: true });
  
        reply.send({ offer: activeOffers, product: filteredProducts });
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/productsOnRetailer",
    { onRequest: [fastify.authenticate] },
    async (req, resp) => {
      try {
        const userid = req.user.userId._id;
        console.log(userid);
        const existingData = await Product.find({ user: userid }).populate(
          "user"
        );

        return existingData;
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/modeltoproduct/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const modelOrProductId = req.params.id;
        existingData = await Model2.find({ _id: modelOrProductId });
        reply.send(existingData);
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/editproduct/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const modelOrProductId = req.params.id;
        const userid = req.user.userId._id;

        let existingData = "";
        existingData = await Product.find({
          $and: [{ "product._id": modelOrProductId }, { user: userid }],
        }).populate("user");

        reply.send(existingData);
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/brandToModel/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const brandId = req.params.id;
        const userid = req.user.userId._id;
        const userData = await User.findById({ _id: userid });

        let existingData;
        if (userData.role == 2) {
          existingData = await Model2.find({ "properties.brand": brandId });
        } else {
          reply.send({ error: "Not authroized" });
        }

        reply.send(existingData);
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/brand-to-product/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const Id = req.params.id;
        let existingData;

        existingData = await Product.find({ "product.properties.brand": Id }).populate('user');
        reply.send(existingData);
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/retailers-product/:id",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const userid = req.params.id;
        const userData = await User.findById({ _id: userid });
        let existingData;

        if (userData.role == 2) {
          existingData = await Product.find({ user: userData }).populate(
            "user"
          );
        } else {
          reply.send({ error: "Not authroized" });
        }

        reply.send(existingData);
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  fastify.get(
    "/notHavingtheRequestedUser",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const userId = req.user.userId._id;
        const userData = await User.findById(userId);
  
        if (userData.role !== 2) {
          return reply.send({ error: "Not authorized" });
        }
  
        // Aggregate to get unique products by groupId
        const uniqueProducts = await Product.aggregate([
          {
            $group: {
              _id: "$groupId",
              products: { $push: "$$ROOT" }, // Push all documents with the same groupId into an array
            },
          },
          { $unwind: "$products" }, // Unwind to get each product separately
          {
            $lookup: {
              from: "users",
              localField: "products.user",
              foreignField: "_id",
              as: "user"
            }
          },
          { $unwind: "$user" }, // Unwind to get the user details
          {
            $group: {
              _id: "$products._id",
              product: { $first: "$products" }, // Keep the first product encountered for each groupId
              user: { $first: "$user" } // Keep the associated user
            }
          },
          { $replaceRoot: { newRoot: "$product" } }
        ]);
  
        // Filter out products associated with the requested user
        const productsNotAssociated = uniqueProducts.filter(product => product.user._id.toString() !== userId);
        console.log(productsNotAssociated.length);
        reply.send(productsNotAssociated);
      } catch (error) {
        console.error(error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
  
  
  
}

module.exports = getProduct;
