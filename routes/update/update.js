const path = require('path');
const fs = require('fs');
const { Brand, Category, Product,SubCategory } = require("../../models/allModels");
const { isNullOrUndefined } = require('util');
async function Update(fastify, options) {
    fastify.register(require('@fastify/multipart'));
    fastify.post('/brand/:id', async (req, reply) => {
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

    fastify.post('/category/:id', async (req, reply) => {
        try {
            const categoryId = req.params.id;
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
            
            const existingCategory = await Category.findById(categoryId);
            if (!existingCategory) {
                return reply.status(404).send({ error: "Category not found !" });
            }
        
            existingCategory.categoryName = name;
            existingCategory.categoryImage = `public/image/${fileName}`;

            const updatedCategory = await existingCategory.save();

            return reply.send({ brand: updatedCategory });
        } catch (error) {
            console.error('Error updating cateogy:', error);
            return reply.status(500).send('Internal Server Error');
        }
    });

    fastify.post('/sub_category/:id', async (req, reply) => {
        try {
            const subCategoryId = req.params.id;
            const parts = req.parts();
            let name;
            let fileName;
            let filePath;
            let hasNameField = false;
            for await (const part of parts) { 
                if (part.type === 'field') {
                    name = part.value.trim();
                    hasNameField = true;
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

            if(!hasNameField){
                return reply.status(400).send({ error: "Name and file fields are required" });
            }
            
            const existingSubCategory = await SubCategory.findById(subCategoryId);
            if (!existingSubCategory) {
                return reply.status(404).send({ error: " Sub Category not found !" });
            }

            if (name !== '' && existingSubCategory.subCategoryName !== name) {
                existingSubCategory.subCategoryName = name;
            } else if (name === '') {
                return reply.status(400).send({ error: "Please enter the name" });
            }

        
            if(existingSubCategory.subCategoryName!=name && name!= '')
            {
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

     fastify.post('/photos/:id', async (req, reply) => {
        try {
            const photosId = req.params.id;
            const parts = req.parts();
            
            photosId.body

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
            
            const existingCategory = await Category.findById(photosId);
            if (!existingCategory) {
                return reply.status(404).send({ error: "Category not found !" });
            }
        
            existingCategory.categoryName = name;
            existingCategory.categoryImage = `public/image/${fileName}`;

            const updatedCategory = await existingCategory.save();

            return reply.send({ brand: updatedCategory });
        } catch (error) {
            console.error('Error updating cateogy:', error);
            return reply.status(500).send('Internal Server Error');
        }
    });
}

module.exports = Update;
