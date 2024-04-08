const path = require('path');
const fs = require('fs');
const { Brand, Category } = require("../../models/allModels");
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
}

module.exports = Update;
