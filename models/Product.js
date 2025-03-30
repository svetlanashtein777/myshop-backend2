const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
});

// Проверяем, была ли модель уже создана
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
