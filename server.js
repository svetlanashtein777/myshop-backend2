import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();
const app = express();
app.use(express.json());

// Разрешаем CORS только для фронтенда
app.use(cors({ origin: "https://myfrontend.vercel.app" }));

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Подключено к MongoDB'))
    .catch(err => console.error('❌ Ошибка подключения:', err));

// Настройка Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Настройка загрузки файлов через Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
        folder: "products",
        format: async () => "jpg",
        public_id: () => Date.now()
    }
});
const upload = multer({ storage });

// Модель товара
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    price: Number,
    image: String
}));

// 📌 Маршрут: Добавить товар
app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        const { name, price } = req.body;
        const image = req.file.path;

        const newProduct = new Product({ name, price, image });
        await newProduct.save();

        res.json({ message: "Товар добавлен!", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// 📌 Маршрут: Получить все товары
app.get('/api/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен: http://localhost:${PORT}`));
