const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Получить все товары
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("Ошибка при получении товаров:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// Добавить новый товар
router.post("/", async (req, res) => {
    try {
        const { name, price, image, description } = req.body;

        if (!name || !price || !image || !description) {
            return res.status(400).json({ message: "Все поля обязательны" });
        }

        const product = new Product({
            name,
            price,
            image,
            description,
        });

        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Ошибка при добавлении товара:", error);
        res.status(400).json({ message: "Ошибка при создании товара" });
    }
});

module.exports = router;
