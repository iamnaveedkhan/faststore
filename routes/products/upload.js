const path = require('path');
const fs = require('fs');
const { Product, Brand, Model, Category, SubCategory, Photo, User, Inquiry } = require("../../models/allModels");
const bcrypt = require('bcrypt');

async function registerImage(fastify, options) {
    fastify.register(require('@fastify/multipart'));
    // fastify.post('/upload/:id', async (req, reply) => {
    //     try {
    //         const parts = req.parts();
    //         let filePath;

    //         let name, category, landmark, userId, fileName;

    //         for await (const part of parts) {
    //             if (part.type === 'file') {
    //                 fileName = part.filename;
    //                 filePath = path.join('public/image/', fileName);
    //                 const writableStream = fs.createWriteStream(filePath);
    //                 await part.file.pipe(writableStream);
    //             } else if (part.type === 'field') {
    //                 if (part.fieldname === 'name') {
    //                    name = part.value;
    //                 } else if (part.fieldname === 'category') {
    //                     category = part.value;
    //                 } else if (part.fieldname === 'landmark') {
    //                     landmark = part.value;
    //                 }
    //             }
    //         }

    //         userId = req.params.id;

    //         const Prod = new Product({
    //             photo: `public/image/${fileName}`,
    //             name,
    //             category,
    //             landmark,
    //             user_id: userId
    //         });

    //         const ProdSaved = await Prod.save();

    //         return { imagePath: filePath };
    //     } catch (error) {
    //         console.error('Error uploading file:', error);
    //         return reply.status(500).send('Internal Server Error');
    //     }
    // });



    fastify.post('/brand', async (req, reply) => {
        try {
            const parts = req.parts();
            let name;
            let fileName;


            for await (const part of parts) {   
                if (part.type === 'file') {
                    fileName = part.filename;
                    filePath = path.join('public/image/', fileName);
                    const writableStream = fs.createWriteStream(filePath);
                    await part.file.pipe(writableStream);
                   
                } else if (part.type === 'field') {
                    if (part.fieldname === 'name') {
                        name = part.value;
                       
                    } 
                }
            }

            
            const existingBrand = await Brand.findOne({ brandName: name });
            if (existingBrand) {
                return reply.status(409).send({ error: "Brand already registered" });
            }
            const brand = new Brand({
                'brandName':name,
                'brandImage': `public/image/${fileName}`,

            });
            const BrandSaved = await brand.save();
            return { brandName: name, };
        } catch (error) {
            console.error('Error uploading file:', error);
            return reply.status(500).send('Internal Server Error');
        }
    });


    fastify.post('/category', async (req, reply) => {
        try {
            const parts = req.parts();
            let name;
            let fileName;

            // let hasNameField = false;
            // let hasFileField = false;

            for await (const part of parts) {   
                if (part.type === 'file') {
                    fileName = part.filename;
                    filePath = path.join('public/image/', fileName);
                    const writableStream = fs.createWriteStream(filePath);
                    await part.file.pipe(writableStream);
                    // hasFileField = true;
                } else if (part.type === 'field') {
                    if (part.fieldname === 'name') {
                        name = part.value;
                        // hasNameField = true;
                    } 
                }
            }

            // if (!hasNameField || !hasFileField) {
            //     return reply.status(400).send({ error: "Name and file fields are required" });
            // }

            const existingBrand = await Category.findOne({ categoryName: name });
            if (existingBrand) {
                return reply.status(409).send({ error: "Category already registered" });
            }
            const category = new Category({
                'categoryName':name,
                'categoryImage':`public/image/${fileName}`,
            });
            const BrandSaved = await category.save();
            return { categoryName: name };
        } catch (error) {
            console.error('Error uploading file:', error);
            return reply.status(500).send('Internal Server Error');
        }
    });



    fastify.post('/sub_category', async (req, reply) => {
        try {
            const parts = req.parts();

            let name, category;
            let fileName;

            for await (const part of parts) {   
                if (part.type === 'file') {
                    fileName = part.filename;
                    filePath = path.join('public/image/', fileName);
                    const writableStream = fs.createWriteStream(filePath);
                    await part.file.pipe(writableStream);
                } else if (part.type === 'field') {
                    if (part.fieldname === 'name') {
                        name = part.value;
                    } else if (part.fieldname === 'category') {
                        category = part.value;
                    }
                }
            }
            const existingBrand = await SubCategory.findOne({ subCategoryName: name });
            if (existingBrand) {
                return reply.status(409).send({ error: "Category already registered" });
            }

            const subcat = new SubCategory({
                subCategoryName:name,
                category: category,
                subCategoryImage:`public/image/${fileName}`,
            });

            const ProdSaved = await subcat.save();

            return { subCategoryName: name };
        } catch (error) {
            console.error('Error uploading file:', error);
            return reply.status(500).send('Internal Server Error');
        }
    });


    fastify.post('/model', async (req, reply) => {
        try {
            const parts = req.parts();
            let filePath;

            let name, category, subCategory,brand, fileName ;

            for await (const part of parts) {
                if (part.type === 'file') {
                    fileName = part.filename;
                    filePath = path.join('public/image/', fileName);
                    const writableStream = fs.createWriteStream(filePath);
                    await part.file.pipe(writableStream);
                } else if (part.type === 'field') {
                    if (part.fieldname === 'name') {
                       name = part.value;
                    } else if (part.fieldname === 'category') {
                        category = part.value;
                    } else if (part.fieldname === 'subcategory') {
                        subCategory = part.value;
                    }else if (part.fieldname === 'brand') {
                        brand = part.value;
                    }
                }
            }
            const existingModel = await Model.findOne({ productName:name });
            if (existingModel) {
                return reply.status(409).send({ error: "Model already registered" });
            }
            const model = new Model({
                photo: `public/image/${fileName}`,
                productName:name,
                brand:brand,
                category:category,
                subCategory:subCategory,
            });
            const ProdSaved = await model.save();
            console.log(model._id)
            const photo = new Photo({
                photos: [`public/image/${fileName}`],
                model:model._id
            });
            const photoSaved = await photo.save();
            return { productName: name };
        } catch (error) {
            console.error('Error uploading file:', error);
            return reply.status(500).send('Internal Server Error');
        }
    });


    fastify.post('/photos', async (req, reply) => {
        try {
            const parts = req.parts();
            let filePath;

            let productModel ;
            let newFile;
            let fileName;
            let phpto = [];
            for await (const part of parts) {
                if (part.type === 'file') {
                    fileName = part.filename;
                    filePath = path.join('public/image/', fileName);
                    const writableStream = fs.createWriteStream(filePath);
                    await part.file.pipe(writableStream);
                    newFile = `public/image/${fileName}`;
                    phpto.push(newFile)
                } else if (part.type === 'field') {
                    if (part.fieldname === 'model') {
                       productModel = part.value;
                    }
                }
            }
            
            const existingModel = await Photo.findOne({ $or: [{ model:productModel }] });
            // phpto.push(existingModel.photos.values);
            // console.log(phpto)
            existingModel.photos = phpto

            const ProdSaved = await existingModel.save();

            return { photos: phpto };
        } catch (error) {
            console.error('Error uploading file:', error);
            return reply.status(500).send('Internal Server Error');
        }
    });





    fastify.post('/product',  { onRequest: [fastify.authenticate] }, async function (req, reply) {
        try {
            // const parts = req.parts();

            const {name,price,quantity} = req.body;
            const shop = req.user.userId._id;

            // for await (const part of parts) {
            //     if (part.type === 'field') {
            //         if (part.fieldname === 'name') {
            //            name = part.value;


            //         } else if (part.fieldname === 'price') {
            //             price = part.value;
            //         } else if (part.fieldname === 'quantity') {
            //             quantity = part.value;
            //         }
            //     }
            // }
            const existingProduct = await Product.findOne({ $or: [{ model___id:name }] });
            if (existingProduct) {
                return reply.status(409).send({ error: "Product Already Added" });
            }
            const user_id = await User.findOne({ $or: [{ _id:shop }] });
            const mymodel = await Model.findOne({ _id:name });
            const cate = await Category.findOne({ _id:mymodel.category._id });
            const subcate = await SubCategory.findOne({ _id:mymodel.subCategory._id });
            const brnd = await Brand.findOne({ _id:mymodel.brand._id });
            const pht = await Photo.findOne({ model:name });
            const prod = new Product({
                model: {
                    _id: mymodel._id,
                    productName: mymodel.productName,
                    photo: mymodel.photo,
                    description: "this is automated description \n  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                },
                brand: {
                    _id: brnd._id,
                    brandName: brnd.brandName
                },
                user: {
                    _id: user_id._id,
                    shopNumber: user_id.mobile,
                    shopName: user_id.name,
                },
                category: {
                    _id: cate._id,
                    categoryName: cate.categoryName
                },
                subCategory: {
                    _id: subcate._id,
                    subCategoryName: subcate.subCategoryName,
                    category: subcate.category
                },
                photos:pht._id,
                specifications: { keyone:"value1" }, // Allow any key-value pairs
                price: price,
                quantity:quantity,
            });

            const ProdSaved = await prod.save();

            return { model_id: name };
        } catch (error) {
            console.error('Error uploading file:', error);
            return reply.status(500).send('Internal Server Error');
        }
    });


    fastify.get('/enquiry/:id', { onRequest: [fastify.authenticate] }, async function (req, reply) {
        try {
            const productId = req.params.id;
            const userId = req.user.userId._id;
            console.log(userId);
            
            const existingProduct = await Product.findOne({ _id: productId });
            if (existingProduct) {
                
                shopName = existingProduct.user._id;
                const product = new Inquiry({
                    'user':userId,
                    'product': productId,
                    'shop':shopName,
                });
                 await product.save();
            }
            
            return { shopName: shopName };
        } catch (error) {
            console.error('Error uploading file:', error);
            return reply.status(500).send('Internal Server Error');
        }
    });    
}


module.exports = registerImage;
