// Настроим Multer для обработки массива изображений
const upload = multer({ storage }).array('images', 10); // Поддержка до 10 изображений

// ✅ Добавить новый товар с загрузкой нескольких изображений
router.post('/', upload, async (req, res) => {
    try {
        console.log('📥 Полученные данные:', req.body);

        const { name, description, price } = req.body;
        if (!req.files || !name || !description || !price) {
            return res.status(400).json({ message: 'Все поля (изображения, name, description, price) обязательны!' });
        }

        // Загрузим изображения в Cloudinary
        const imageUrls = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                if (error) {
                    console.error('❌ Ошибка загрузки изображения в Cloudinary:', error);
                    return res.status(500).json({ message: 'Ошибка загрузки изображения' });
                }
                imageUrls.push(result.secure_url);
            });

            result.end(file.buffer); // Передаем файл в Cloudinary
        }

        // Создание нового товара
        const newProduct = new Product({
            imageUrls,  // Используем массив URL-ов изображений
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
