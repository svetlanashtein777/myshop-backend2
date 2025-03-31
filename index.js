const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// ������祭�� � MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB ������祭"))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('��ࢥ� ࠡ�⠥�!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`��ࢥ� ����饭 �� ����� ${PORT}`));
����� �뢮�� ������ �� �࠭ (ECHO) ����祭.
