const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Импортируем модель

// Получить все товары
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({}, { createdAt: 0, updatedAt: 0 }); // Исключаем createdAt и updatedAt
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
});

// Добавить новый товар
router.post('/', async (req, res) => {
    try {
        console.log('📥 Полученные данные:', req.body); // Логирование для отладки

        const { imageUrl, name, description, price } = req.body;

        if (!imageUrl || !name || !description || !price) {
            return res.status(400).json({ message: 'Все поля (imageUrl, name, description, price) обязательны!' });
        }

        const newProduct = new Product({ imageUrl, name, description, price });
        await newProduct.save();

        // Убираем createdAt и updatedAt перед отправкой
        const { createdAt, updatedAt, ...productData } = newProduct.toObject();

        res.status(201).json(productData);
    } catch (error) {
        console.error('❌ Ошибка при создании товара:', error);
        res.status(500).json({ message: 'Ошибка при создании товара', error });
    }
});

// Получить товар по ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id, { createdAt: 0, updatedAt: 0 }); // Исключаем createdAt и updatedAt
        if (!product) {
            return res.status(404).json({ message: 'Товар не найден' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
});

// Удалить товар по ID
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Товар не найден' });
        }
        res.json({ message: 'Товар удалён' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
});

module.exports = router;
