# SaphFox

A modern, open-source content-sharing platform built with Node.js and Express, designed for creators to share and engage with video content.

![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)

## 💡 Open Source & Community Driven

SaphFox is an **open-source** project released under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). This license allows anyone to share and adapt the project for non-commercial use, making SaphFox accessible for personal or educational purposes. We’re committed to transparency, collaboration, and creating a welcoming space for contributions. 

If you’re interested in contributing, we’d love to have you on board—whether it’s through new feature ideas, bug fixes, UI improvements, or performance optimizations. Our platform is **for the community, by the community**.

## 🌟 Features

- **Intuitive Video Sharing**: Upload, watch, and share videos with ease
- **Real-time Interactions**: Like videos and track view counts
- **Modern UI/UX**: Clean, responsive design with dark mode
- **Client-side Processing**: Efficient video handling and progress tracking
- **Category Management**: Organize content with customizable categories
- **Search Functionality**: Quick and responsive content discovery
- **User Profiles**: Personal channels and content management
- **Mobile Responsive**: Optimized for all device sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Saphfox/saphfox.git
   cd saphfox
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create required directories:
   ```bash
   mkdir uploads
   mkdir public
   ```

4. Start the server:
   ```bash
   npm start
   # or
   yarn start
   ```

The application will be available at `http://localhost:3000`

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **File Handling**: Multer
- **Frontend**: HTML5, CSS3, JavaScript
- **Icons**: Font Awesome
- **Styling**: Custom CSS with CSS Variables

## 📁 Project Structure

```
saphfox/
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── index.html
├── uploads/
├── server.js
├── package.json
└── README.md
```

## 🔧 Configuration

Server configuration can be modified through environment variables:

- `PORT`: Server port (default: 3000)
- `UPLOAD_LIMIT`: Maximum upload size (default: 100MB)

## 🌐 API Endpoints

| Method | Endpoint             | Description              |
|--------|-----------------------|--------------------------|
| GET    | `/`                  | Serve main application   |
| POST   | `/upload`            | Upload new video         |
| GET    | `/videos`            | Get all videos           |
| POST   | `/videos/:id/like`   | Like a video             |
| GET    | `/videos/:id/view`   | Register video view      |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

**This Project Uses Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0).**

Under this license, you are free to:
- **Share**: Copy and redistribute the material in any medium or format
- **Adapt**: Remix, transform, and build upon the material

**With the following terms:**
- **Attribution**: You must give appropriate credit.
- **NonCommercial**: You may not use the material for commercial purposes.

## 📧 Contact

Project Link: [https://github.com/Saphfox/saphfox](https://github.com/Saphfox/saphfox)