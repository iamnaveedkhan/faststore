const path = require('path');
const fs = require('fs');
const { Brand, Category, Product,SubCategory, User } = require("../../models/allModels");
const { isNullOrUndefined } = require('util');
const { send } = require('process');
async function Update(fastify, options) {
    fastify.register(require('@fastify/multipart'));
    fastify.post('/brand/:id',{ onRequest: [fastify.authenticate] }, async (req, reply) => {
        try {
            const brandId = req.params.id;
            const parts = req.parts();
            let name;
            let fileName;
            let filePath;
            for await (const part of parts) { 
                if(part.type === 'field'){
                    name = part.value;
                } else if (part.type === 'file') {
                    fileName = part.filename;
                    filePath = path.join('public/image/', fileName);
                    const writableStream = fs.createWriteStream(filePath);
                    await part.file.pipe(writableStream);
                } 
            }
            const existingBrand = await Brand.findById(brandId);
            if (!existingBrand) {
                return reply.status(404).send({ error: "Brand not found" });
            }
            existingBrand.brandName = name;
            existingBrand.brandImage = `public/image/${fileName}`;
            const updatedBrand = await existingBrand.save();


            const exsistingProduct = await Product.find({"brand._id":existingBrand._id})
            for await (const x of exsistingProduct) { 
                exsistingProduct.brand.brandName = name;
                exsistingProduct.brand.brandImage = `public/image/${fileName}`;
                const updatedProduct = await exsistingProduct.save();
            }
            
            return reply.send({ brand: updatedBrand });
        } catch (error) {
            console.error('Error updating brand:', error);
            return reply.status(500).send('Internal Server Error');
        }
    });

    fastify.post('/category/:id', { onRequest: [fastify.authenticate] }, async (req, reply) => {
        try {
            const categoryId = req.params.id;
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
            
            const existingCategory = await Category.findById(categoryId);
            if (!existingCategory) {
                return reply.status(404).send({ error: " Sub Category not found !" });
            }

            if (name != '' && existingCategory.categoryName != name && name!=undefined) {
                existingCategory.categoryName = name;
            }
            else{

            }
             
            if(fileName!=undefined || fileName!= null){
                existingCategory.categoryImage = `public/image/${fileName}`;
            }
    
            const updatedCategory = await existingCategory.save();

            return reply.send({ brand: updatedCategory });
        } catch (error) {
            console.error('Error updating cateogy:', error);
            return reply.status(500).send('Internal Server Error');
        }
    });

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
