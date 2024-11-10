const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Video storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept only video files
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed!'));
        }
    },
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

// In-memory storage for videos (replace with database in production)
let videos = [];

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file uploaded' });
        }

        const video = {
            id: Date.now().toString(),
            title: req.body.title || 'Untitled Video',
            description: req.body.description || '',
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`,
            uploadDate: new Date(),
            views: 0,
            likes: 0
        };

        videos.push(video);
        res.status(200).json(video);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/videos', (req, res) => {
    res.json(videos);
});

app.post('/videos/:id/like', (req, res) => {
    const video = videos.find(v => v.id === req.params.id);
    if (video) {
        video.likes++;
        res.json({ likes: video.likes });
    } else {
        res.status(404).json({ error: 'Video not found' });
    }
});

app.get('/videos/:id/view', (req, res) => {
    const video = videos.find(v => v.id === req.params.id);
    if (video) {
        video.views++;
        res.json({ views: video.views });
    } else {
        res.status(404).json({ error: 'Video not found' });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
    console.log(`SaphFox is running on http://localhost:${PORT}`);
});