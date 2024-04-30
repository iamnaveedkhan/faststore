const { Specification , Model2 } = require("../../models/allModels");

async function addSpecification(fastify, options) {
    fastify.post('/add-specifications', async (request, reply) => {
        try {
            const mainKeys = Array.isArray(request.body.mainKey) ? request.body.mainKey : [request.body.mainKey];
            const name = request.body.name;
    
            // Create an array to store specifications
            const specifications = [];
    
            // Loop through each main key
            for (let i = 0; i < mainKeys.length; i++) {
                const keyNames = Array.isArray(request.body[`mainKey[${i}][keyName][]`]) ? request.body[`mainKey[${i}][keyName][]`] : [request.body[`mainKey[${i}][keyName][]`]];
                const keyTypes = Array.isArray(request.body[`mainKey[${i}][keyType][]`]) ? request.body[`mainKey[${i}][keyType][]`] : [request.body[`mainKey[${i}][keyType][]`]];
                const isFilters = Array.isArray(request.body[`mainKey[${i}][isFilter][]`]) ? request.body[`mainKey[${i}][isFilter][]`] : [request.body[`mainKey[${i}][isFilter][]`]];
                const isMandatories = Array.isArray(request.body[`mainKey[${i}][isMandatory][]`]) ? request.body[`mainKey[${i}][isMandatory][]`] : [request.body[`mainKey[${i}][isMandatory][]`]];
                const isVariants = Array.isArray(request.body[`mainKey[${i}][isVariant][]`]) ? request.body[`mainKey[${i}][isVariant][]`] : [request.body[`mainKey[${i}][isVariant][]`]];
                const enumOptions = Array.isArray(request.body[`mainKey[${i}][enumOptions][]`]) ? request.body[`mainKey[${i}][enumOptions][]`] : [request.body[`mainKey[${i}][enumOptions][]`]]; // Added this line
    
                // Create an array to store keys
                const keys = [];
    
                // Loop through each key name
                for (let j = 0; j < keyNames.length; j++) {
                    const type = keyTypes[j];
                    let options = null; // Initialize options
    
                    // If the type is 'enum', split the enumOptions by comma and store in an array
                    if (type === 'enum') {
                        options = enumOptions[j].split(',').map(option => option.trim());
                    }
    
                    // Push each key and its attributes to the keys array
                    keys.push({
                        name: keyNames[j],
                        type: type,
                        options: options, // Add options field
                        isFilter: isFilters[j] ? true : false,
                        isMandatory: isMandatories[j] ? true : false,
                        isVariant: isVariants[j] ? true : false
                    });
                }
    
                // Push each main key and its corresponding keys to the specifications array
                const mainKeyName = mainKeys[i];
                const specObj = {};
                specObj[mainKeyName] = keys;
                specifications.push(specObj);
            }
    
            // Create a new Specification document
            const spec = new Specification({
                name: name,
                specification: specifications
            });
    
            // Save the document to the database
            const savedSpec = await spec.save();
    
            // Send response
            reply.code(201).send(savedSpec);
        } catch (error) {
            console.error('Error saving specifications:', error);
            reply.code(500).send({ error: 'Internal Server Error' });
        }
    });
    


    fastify.post('/add-models', async (request, reply) => {
        try {
            const specifications = request.body.specification;
            
            // Create a new Specification document
            const spec = new Model2({
                type: request.body.name, // Assuming 'name' here represents the type
                specification: specifications
            });
    
            // Save the document to the database
            const savedSpec = await spec.save();
    
            // Send response
            reply.code(201).send(savedSpec);
        } catch (error) {
            console.error('Error saving specifications:', error);
            reply.code(500).send({ error: 'Internal Server Error' });
        }
    });
    
    
}

module.exports = addSpecification;
