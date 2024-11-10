const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('SaphFox Video Platformu - Ana Sayfa');
});

app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Videoların yükleneceği klasör

app.post('/upload', upload.single('video'), (req, res) => {
    res.send('Video başarıyla yüklendi!');
});
