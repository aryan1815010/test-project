const mongoose = require("mongoose");
const randToken = require("rand-token");

const UserSchema = new mongoose.Schema({
  email: { type: String },
  name: { type: String },
  password: { type: String },
  activated: { type: Number, default: 0 },
  activation_token: {
    type: String,
    default: () => randToken.generate(16),
  },
});

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  description: { type: String },
  slug: { type: String },
});

const OrderProductSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  description: { type: String },
  qty: { type: Number },
  slug: { type: String },
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.ObjectId },
  products: { type: [OrderProductSchema] },
  address: { type: String },
  orderdate: { type: Date },
  total: { type: Number },
});

const SavedSchema = new mongoose.Schema({
  userid: { type: String, ref: "User" },
  product: { type: String, ref: "Product" },
});

const userModel = mongoose.model("User", UserSchema, "users");
const productModel = mongoose.model("Product", ProductSchema, "products");
const orderModel = mongoose.model("Order", OrderSchema, "orders");
const savedModel = mongoose.model("Saved", SavedSchema, "saved");

module.exports = { userModel, productModel, orderModel, savedModel };
