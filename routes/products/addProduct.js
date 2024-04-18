const {User} = require("../../models/allModels");
fastify.post('/addproduct', { onRequest: [fastify.authenticate] }, async (req, reply) => {
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
                fileName = part.filename;
                const filePath = path.join("public/image/", fileName);
                const writableStream = fs.createWriteStream(filePath);
                await part.file.pipe(writableStream);
                photos.push = `public/image/${fileName}`;

            } else {
                if (part.fieldname.startsWith('specification.')) {
                    data[part.fieldname] = part.value;
                } else if (part.fieldname.startsWith('properties.')) {
                    // Convert string values to ObjectId
                    data[part.fieldname] = part.value;
                } else {
                    data[part.fieldname] = part.value;
                }
            }
        }
        data['photo'] = photos;
        const newModel = new Model2(data);

        const savedModel = await newModel.save();

        return savedModel;
    } catch (error) {

        console.error('Error adding model:', error);
        reply.code(500).send({ error: 'Internal Server Error' });
    }
});