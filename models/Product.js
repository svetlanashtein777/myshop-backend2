const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrls: { type: [String], required: true }  // Изменено на массив строк
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
