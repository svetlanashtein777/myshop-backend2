const express = require('express');
const router = express.Router();
const multer = require('multer');  // Здесь импортируется multer
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Настройка Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Настройка Multer для обработки файлов
const storage = multer.memoryStorage();
const upload = multer({ storage }).array('images', 10); // Поддержка до 10 изображений

// ✅ Получить все товары
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({}, { createdAt: 0, updatedAt: 0 }); // Исключаем createdAt и updatedAt
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
});

// ✅ Добавить новый товар с загрузкой изображения
router.post('/', upload, async (req, res) => {
    try {
        console.log('📥 Полученные данные:', req.body);

        const { name, description, price } = req.body;
        if (!req.files || !name || !description || !price) {
            return res.status(400).json({ message: 'Все поля (изображение, name, description, price) обязательны!' });
        }

        // Загружаем все изображения в Cloudinary
        const imageUrls = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
                if (error) {
                    console.error('❌ Ошибка загрузки изображения в Cloudinary:', error);
                    return res.status(500).json({ message: 'Ошибка загрузки изображения' });
                }
                imageUrls.push(result.secure_url);
            });
            result.end(file.buffer);
        }

        // Создание нового товара с несколькими изображениями
        const newProduct = new Product({
            imageUrl: imageUrls, // Массив с URL изображений
            name,
            description,
            price
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('❌ Ошибка при создании товара:', error);
        res.status(500).json({ message: 'Ошибка при создании товара', error });
    }
});

// ✅ Получить товар по ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id, { createdAt: 0, updatedAt: 0 });
        if (!product) {
            return res.status(404).json({ message: 'Товар не найден' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера', error });
    }
});

// ✅ Удалить товар по ID
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
