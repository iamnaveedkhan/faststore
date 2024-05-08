const path = require('path');
const fs = require('fs');
const { Brand, Category, Product,SubCategory, User } = require("../../models/allModels");
const { isNullOrUndefined } = require('util');
const { send } = require('process');
async function Update(fastify, options) {
    fastify.register(require('@fastify/multipart'));
  

   

    fastify.post('/sub_category/:id',{ onRequest: [fastify.authenticate] }, async (req, reply) => {
        try {
            const subCategoryId = req.params.id;
            const parts = req.parts();
            let name;
            let fileName;
            let filePath;
            for await (const part of parts) { 
                if (part.type === 'field') {
                    name = part.value.trim();
                } else if (part.type === 'file') {
                    if (part.filename) {
                        fileName = part.filename;
                        filePath = path.join('public/image/', fileName);
                        const writableStream = fs.createWriteStream(filePath);
                        await part.file.pipe(writableStream);
                    } else {
                        console.log("No file sent");
                    }
                } 
            }
          
            const existingSubCategory = await SubCategory.findById(subCategoryId);
            if (!existingSubCategory) {
                return reply.status(404).send({ error: " Sub Category not found !" });
            }

            if (name != '' && existingSubCategory.subCategoryName != name) {
                existingSubCategory.subCategoryName = name;
            }
             
            if(fileName!=undefined || fileName!= null){
                existingSubCategory.subCategoryImage = `public/image/${fileName}`;
            }
    
            const updatedSubCategory = await existingSubCategory.save();

            return reply.send({ brand: updatedSubCategory });
        } catch (error) {
            console.error('Error updating sub cateogy:', error);
            return reply.status(500).send('Internal Server Error');
        }
    });

    fastify.post('/updateuser', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        try {
            const userid = req.user.userId._id;
            const parts = req.parts();
    
            let userData = await User.findById({_id: userid});
    
            let newName, fileName, filePath;
            let data = {}; // Changed from array to object
    
            for await (const part of parts) { 
                if(userData.role == 1){
                    if (part.type === 'field'  && part.fieldname == 'name' ) {
                        newName = part.value.trim();
                        userData.name = newName;
                    }
                }
                else if(userData.role == 2){
                    if (part.type === "field") {
                        data[part.fieldname] = part.value;
                    } else if (part.type === "file") {
                        fileName = part.filename;
                        filePath = path.join("public/image/", fileName);
                        const writableStream = fs.createWriteStream(filePath);
                        await part.file.pipe(writableStream);
                        data['photo'] = `public/image/${fileName}`
                    }
                }    
            }
    
            // Update userData with data
            if(userData.role == 2){
                Object.assign(userData, data);
            }
    
            await userData.save();
    
            return userData;
    
        } catch (error) {
            console.error('Error processing request:', error);
            reply.status(500).send('Internal Server Error');
        }
    });
    
    
}

module.exports = Update;
