const path = require("path");
const fs = require("fs");
const models = require("../../models/allModels");
const {
  Address,
  Customer,
  Retailer,
  Staff,
  Status,
} = require("../../models/allModels");
const bcrypt = require("bcrypt");

async function registerUser(fastify, options) {
  fastify.register(require("@fastify/multipart"));

  fastify.post("/register", async (req, reply) => {
    try {
      const data = req.body;
      const type = req.body.type;
      let savedUser;

      const customer = new Customer(data);
      const retailer = new Retailer(data);
      const staff = new Staff(data);

      if (type == "customer") {
        savedUser = await customer.save();
      } else if (type == "retailer") {
        savedUser = await retailer.save();
      } else if (type == "staff") {
        savedUser = await staff.save();
      } else {
        return reply.send({ error: "something went wrong !" });
      }

      let savedAddress;
      if (type == "retailer") {
        data["retailer"] = savedUser._id;
        const UserAddres = new Address(data);
        savedAddress = await UserAddres.save();
      }

      const token = fastify.jwt.sign({ userId: savedUser });
      var status = "success";

      return reply.send({ savedAddress, savedUser, token, status });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  fastify.post("/update-retailer-informations",{ onRequest: [fastify.authenticate] }, async (req, reply) => {
    try {

      const managerId = req.user.userId._id;
      const parts = req.parts();
  
      let formData = {};
      let fileName;
      let filePath;
      let mobileNo;
      
      for await (const part of parts) {
        if (part.type === "field") {
          if(part.fieldname === "mobile"){
            mobileNo = part.value;
          }
          formData[part.fieldname] = part.value;
        } else if (part.type === "file") {
          fileName = part.filename;
          filePath = path.join("public/image/", fileName);
          const writableStream = fs.createWriteStream(filePath);
          await part.file.pipe(writableStream);
          formData['shopLogo'] = fileName; 
        }
      }

      let retailerData = await Retailer.findOne({mobile:mobileNo});
      if(!retailerData){
        return reply.code(401).send({ error: "Retailer Not Found!" });
      }else{
        retailerData.name = formData.name;
        retailerData.email = formData.email;
        retailerData.retailerShopLogo = `public/image/${fileName}`;
        retailerData.comment = "Activated" ;
        retailerData.isActive = true;
        retailerData.status = 1;
        retailerData.latitude = formData.latitude;
        retailerData.longitude = formData.longitude;

        let address = new Address({
          address: formData.address,
          city: formData.city,
          state: formData.state,
          retailer: retailerData._id,
        })

        const statusData = new Status();
        statusData.manager = managerId;
        statusData.retailer = retailerData._id;
        statusData.comment = "Activated";
        statusData.status = 1;
        await statusData.save();

        await address.save();
        await retailerData.save();
      }
  
      console.log("Received form data:sssssssssssssssssssssssss", formData);

      return reply.send({ message: 'Data received successfully', formData });
    } catch (error) {
      console.error(error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  fastify.post(
    "/register-staff",
    { onRequest: [fastify.authenticate] },
    async (req, reply) => {
      try {
        const userId = req.user.userId._id;
        const data = req.body;

        let savedUser;
        const ADMIN = await Staff.findById(userId);

        if (ADMIN.role == 0 && ADMIN.isActive) {
          const staff = new Staff(data);
          savedUser = await staff.save();
        }

        var status = "success";

        return reply.send({ savedUser, status });
      } catch (error) {
        console.error(error);
        reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}

module.exports = registerUser;
