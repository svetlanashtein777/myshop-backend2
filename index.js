const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Загружаем переменные окружения из .env

const app = express();

// ✅ Middleware (Парсим JSON, разрешаем CORS)
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Позволяет работать с form-data
app.use(cors()); 

// ✅ Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB подключен'))
  .catch(err => console.error('❌ Ошибка подключения к MongoDB:', err));

// ✅ Тестовый маршрут для проверки express.json()
app.post('/test-json', (req, res) => {
    console.log('Полученные данные:', req.body);
    res.json({ message: '✅ JSON успешно обработан', data: req.body });
});

// ✅ Импортируем маршруты товаров
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes); 

// ✅ Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
