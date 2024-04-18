fastify.post('/addmodel', async (req, reply) => {
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
                data['photo'] = `public/image/${fileName}`;
            } else {
                // Handle other form fields
                if (part.fieldname.startsWith('variants[]')) {
                  del  // It's a variant field
                    data[part.fieldname] = part.value;
                } else if (part.fieldname.startsWith('properties.')) {
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
        console.error('Error adding model:', error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
});