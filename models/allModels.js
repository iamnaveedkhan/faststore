const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require("moment-timezone");
const crypto = require("crypto");

const dateIndia = moment.tz("Asia/kolkata");
const formattedDate = dateIndia.format();

const glgSchema = new Schema({
  photo3d: { type: String, default: "" },
});

const staffSchema = new Schema({
  name: { type: String, default: "" },
  mobile: { type: Number },
  email: { type: String, unique: true },
  role: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  sId: {
    type: String,
    default: function () {
      return crypto.randomBytes(4).toString("hex");
    },
    unique: true
  },
  manager: { type: Schema.Types.ObjectId, ref: "Staff" },
  date: { type: Date, default: Date.now },
  password: { type: String },
});

const customerSchema = new Schema({
  name: { type: String, default: "" },
  mobile: { type: Number, unique: true },
  email: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  cId: {
    type: String,
    default: function () {
      return crypto.randomBytes(4).toString("hex");
    },
    unique: true
  },
  liked: {type: Number, default: 0},
  longitude: { type: String, default: "" },
  latitude: { type: String, default: "" },
  firetoken: { type: String, default: "" },
  date: { type: Date, default: Date.now },
});

const retailerSchema = new Schema({
  name: { type: String, default: "" },
  mobile: { type: Number, unique: true },
  email: { type: String, default: "" },
  comment: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  longitude: { type: String, default: "" },
  latitude: { type: String, default: "" },
  firetoken: { type: String, default: "" },
  status: { type: Number, default: 1 },
  rId: {
    type: String,
    default: function () {
      return crypto.randomBytes(4).toString("hex");
    },
    unique: true
  },
  manager: { type: Schema.Types.ObjectId, ref: "Staff", default: null },
  pickedDate: { type: Date, default: null },
  statusDate: { type: Date, default: Date.now },
  date: { type: Date, default: Date.now },
  retailerShopLogo: { type: String, default: "" },
  isSponsored : { type: Boolean, default: false },
});

const statusSchema = new Schema({
  manager: { type: Schema.Types.ObjectId, ref: "Staff" },
  retailer: { type: Schema.Types.ObjectId, ref: "Retailer" },
  comment: { type: String, default: "" },
  status: { type: Number, default: null },
  date: { type: Date, default: Date.now },
});

const followupSchema = new Schema({
  manager: { type: Schema.Types.ObjectId, ref: "Staff" },
  retailer: { type: Schema.Types.ObjectId, ref: "Retailer" },
  followupDate: { type: Date, default: Date.now },
  comment: { type: String, default: "" },
  followupStatus: { type: Number, default: null },
  date: { type: Date, default: Date.now },
});

const addressesSchema = new mongoose.Schema({
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  retailer: { type: Schema.Types.ObjectId, ref: "Retailer" },
});

const ordersSchema = new mongoose.Schema({
  orderDate: { type: Date, default: Date.now },
  status: { type: Number, default: 1 },
  orderId: { type: String, default: null },
  product: { type: Schema.Types.ObjectId, ref: "Product" },
});

const brandSchema = new mongoose.Schema({
  brandName: { type: String, default: null },
  brandImage: { type: String, default: null },
});

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, default: null },
  categoryImage: { type: String, default: null },
});

const subCategorySchema = new mongoose.Schema({
  subCategoryName: { type: String, default: null },
  subCategoryImage: { type: String, default: null },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
});

const modelSchema = new mongoose.Schema({
  productName: { type: String, default: null },
  photo: { type: String, default: " " },
  brand: { type: Schema.Types.ObjectId, ref: "Brand" },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  subCategory: { type: Schema.Types.ObjectId, ref: "SubCategory" },
});

const model2Schema = new mongoose.Schema({
  groupId: {
    type: String,
    default: function () {
      return Math.random().toString(36).substring(7);
    },
  },
  productName: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    default: null,
  },
  main: { type: Boolean, default: false },
  productLink: { type: String, default: "" },
  colorCode: { type: String, default: "" },
  properties: {
    category: { type: String, default: null },
    subcategory: { type: String, default: null },
    vertical: { type: String, default: null },
    brand: { type: String, default: null },
  },
  photo: { type: [String], default: null },

  isActive: { type: Boolean, default: true },

  specification: mongoose.Schema.Types.Mixed,
  date: { type: Date, default: Date.now },
});

const likedSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "Customer" },
  liked: [String],
});

const viewedSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "Customer" },
  viewed: [String],
});

const productSchema = new mongoose.Schema({
  product: model2Schema,
  user: { type: Schema.Types.ObjectId, ref: "Retailer" },
  price: { type: Number },
  quantity: { type: Number },
  date: {
    type: Date,
    default: formattedDate,
  },
  featured: { type: Boolean, default: false },
  liked: { type: Number, default: 0 },
  viewed: { type: Number, default: 0 },
  enquired: { type: Number, default: 0 },
});

const offersSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "Retailer" },
  photos: { type: String },
  isActive: { type: Boolean, default: true },
});

const inquirySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  customer: {
    _id: { type: "string" },
    customerNumber: { type: Number },
    customerName: { type: String },
  },
  shop: {
    _id: { type: "string" },
    shopNumber: { type: Number },
    shopName: { type: String },
  },
  product: {
    _id: { type: "string" },
    productName: { type: "string" },
    photo: { type: "string" },
    groupId: { type: "string" },
    modelId: { type: "string" },
  },
});

const specificationSchema = new mongoose.Schema({
  name: { type: String, required: false },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  // subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
  specification: mongoose.Schema.Types.Mixed,

  date: {
    type: Date,
    default: formattedDate,
  },
});

const chatSchema = new mongoose.Schema({
  retailer: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  isRequest: { type: Boolean, default: false },
  status: { type: Number, default: false },
  messages: [
    {
      sender: { type: String  },
      receiver: { type: String},
      content: String,
      timestamp: { type: Date, default: Date.now },
      isRead: { type: Boolean, default: false },
      isImage: { type: Number, default: 0 },
      image: { type: String, default: "" },
    },
  ],
});

const productReviewSchema = new mongoose.Schema({
  productGroupId: {type:String, default:''},
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  review: {type:String, default:''},
  image : [{type:String,default:''}],
  rating: { type: Number, default: 1 },
  date: { type: Date, default: Date.now },
});

const shopReviewSchema = new mongoose.Schema({
  retailer: { type: mongoose.Schema.Types.ObjectId, ref: "Retailer" },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  review: {type:String, default:''},
  rating: { type: Number, default: 1 },
  date: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);
const Photo3D = mongoose.model("Photo3D", glgSchema);
const Staff = mongoose.model("Staff", staffSchema);
const Customer = mongoose.model("Customer", customerSchema);
const Retailer = mongoose.model("Retailer", retailerSchema);
const Address = mongoose.model("Address", addressesSchema);
const Order = mongoose.model("Order", ordersSchema);
const Product = mongoose.model("Product", productSchema);
const Brand = mongoose.model("Brand", brandSchema);
const Category = mongoose.model("Category", categorySchema);
const SubCategory = mongoose.model("SubCategory", subCategorySchema);
const Model = mongoose.model("Model", modelSchema);
const Model2 = mongoose.model("Model2", model2Schema);
const Offers = mongoose.model("Offers", offersSchema);
const Inquiry = mongoose.model("Inquiry", inquirySchema);
const Liked = mongoose.model("Like", likedSchema);
const Viewed = mongoose.model("View", viewedSchema);
const Specification = mongoose.model("Specification", specificationSchema);
const FollowUp = mongoose.model("FollowUp", followupSchema);
const Status = mongoose.model("Status", statusSchema);
const ProductReview = mongoose.model("ProductReview", productReviewSchema);
const ShopReview = mongoose.model("ShopReview", shopReviewSchema);

module.exports = {
  Chat,
  Liked,
  Viewed,
  Specification,
  Photo3D,
  Staff,
  Customer,
  Retailer,
  Brand,
  Category,
  SubCategory,
  Model,
  Address,
  Order,
  Product,
  Model2,
  Offers,
  Inquiry,
  FollowUp,
  Status,
  ProductReview,
  ShopReview,
};
