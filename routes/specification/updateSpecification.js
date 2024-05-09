
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