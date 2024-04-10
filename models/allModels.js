const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    name: { type: String, default: null },
    mobile: { type: Number, unique: true },
    role: { type: Number, default: 1 },
    isActive : { type:Number, default : 1},
    password:{type:String,default:"Zerotouch"}
});

const addressesSchema = new mongoose.Schema({
    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
});

const ordersSchema = new mongoose.Schema({
    orderDate: { type: Date, default: Date.now },
    status: { type: Number, default: 1 },
    orderId: { type: String, default: null },
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
});

const brandSchema = new mongoose.Schema({
    brandName: { type: String, default: null },
    brandImage: { type: String, default: null },
});

const categorySchema = new mongoose.Schema({
    categoryName: { type: String, default: null },
    categoryImage: { type: String },
});

const subCategorySchema = new mongoose.Schema({
    subCategoryName: { type: String, default: null },
    subCategoryImage: { type: String, default: null },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
});

const modelSchema = new mongoose.Schema({
    productName: { type: String, default: null },
    photo: { type : String, default: " " },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
});

// const productSchema = new mongoose.Schema({
//     productDate: { type: Date, default: Date.now },
//     quantity: { type: Number, default: 1 },
//     user_id: { type: Schema.Types.ObjectId, ref: 'User' },
//     model: { type: Schema.Types.ObjectId, ref: 'Model' },
//     price: { type : Number, default: null },
// });

const photoSchema = new mongoose.Schema({
    model: { type: Schema.Types.ObjectId, ref: 'Model' },
    photos: { type: [String] } // Array of strings representing URLs
});

const productSchema = new mongoose.Schema({
    model: {
        _id: { type: 'string' },
        productName: { type: 'string' },
        photo: { type: 'string' },
        description: { type: 'string' },
    },
    brand: {
        _id: { type: 'string' },
        brandName: { type: 'string' },
        brandImage: { type: 'string' }
    },
    user: {
        _id: { type: 'string' },
        shopNumber: { type: Number },
        shopName: { type: String },
    },
    category: {
        _id: { type: 'string' },
        categoryName: { type: 'string' }
    },
    subCategory: {
        _id: { type: 'string' },
        subCategoryName: { type: 'string' },
        category: { type: 'string' }
    },
    photos: { type: Schema.Types.ObjectId, ref: 'Photo' },
    specifications: { type: 'object' }, // Allow any key-value pairs
    price: { type: 'number' },
    quantity: { type: 'number' },
    productDate: { type: Date, default: Date.now },
});


const inquirySchema = new mongoose.Schema({
    date:{ type: Date, default: Date.now },
    customer: {
        _id: { type: 'string' },
        customerNumber: { type: Number },
        customerName: { type: String },
    },
    shop: {
        _id: { type: 'string' },
        shopNumber: { type: Number },
        shopName: { type: String },
    },
    product: {
            _id: { type: 'string' },
            productName: { type: 'string' },
            photo: { type: 'string' },
        },

});

const User = mongoose.model('User', userSchema);
const Address = mongoose.model('Address', addressesSchema);
const Order = mongoose.model('Order', ordersSchema);
const Product = mongoose.model('Product', productSchema);
const Brand = mongoose.model('Brand', brandSchema);
const Category = mongoose.model('Category', categorySchema);
const SubCategory = mongoose.model('SubCategory', subCategorySchema);
const Model = mongoose.model('Model', modelSchema);
const Photo = mongoose.model('Photo',photoSchema);
const Inquiry = mongoose.model('Inquiry',inquirySchema);

module.exports = { User, Brand, Category, SubCategory, Model, Address, Order, Product, Photo, Inquiry};
