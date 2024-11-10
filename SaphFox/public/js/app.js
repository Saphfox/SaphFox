// DOM Elements
const uploadModal = document.getElementById('uploadModal');
const videoPlayerModal = document.getElementById('videoPlayerModal');
const uploadBtn = document.getElementById('uploadBtn');
const closeBtns = document.getElementsByClassName('close');
const uploadForm = document.getElementById('uploadForm');
const progressBar = document.getElementById('progressBar');
const videoGrid = document.getElementById('videoGrid');
const videoPlayer = document.getElementById('videoPlayer');
const videoTitle = document.getElementById('videoTitle');
const videoDescription = document.getElementById('videoDescription');
const viewCount = document.getElementById('viewCount');
const likeButton = document.getElementById('likeButton');
const likeCount = document.getElementById('likeCount');
const categoryTabs = document.querySelector('.category-tabs');
const searchInput = document.querySelector('.search-container input');
const searchBtn = document.querySelector('.search-btn');
const profileMenu = document.querySelector('.profile-menu');
const uploadArea = document.querySelector('.upload-area');
const browseBtn = document.querySelector('.browse-btn');
const videoInput = document.getElementById('video');
const thumbnailInput = document.getElementById('thumbnail');

// Current state
let currentVideo = null;
let currentCategory = 'For You';
let isUploading = false;
let likedVideos = new Set();

// Profile Menu Interactions
profileMenu.addEventListener('click', (e) => {
    const dropdown = profileMenu.querySelector('.profile-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    e.stopPropagation();
});

document.addEventListener('click', () => {
    const dropdown = profileMenu.querySelector('.profile-dropdown');
    dropdown.style.display = 'none';
});

// Category Tabs
categoryTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-tab')) {
        const tabs = categoryTabs.querySelectorAll('.category-tab');
        tabs.forEach(tab => tab.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.textContent;
        loadVideos(currentCategory);
    }
});

// Search Functionality
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchVideos(e.target.value);
    }, 500);
});

searchBtn.addEventListener('click', () => {
    searchVideos(searchInput.value);
});

async function searchVideos(query) {
    try {
        const response = await fetch(`/videos/search?q=${encodeURIComponent(query)}`);
        const videos = await response.json();
        renderVideos(videos);
    } catch (error) {
        showNotification('Search failed', 'error');
    }
}

// Enhanced Upload Functionality
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('video/')) {
        videoInput.files = files;
        updateUploadPlaceholder(files[0].name);
    }
});

browseBtn.addEventListener('click', () => {
    videoInput.click();
});

videoInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        updateUploadPlaceholder(e.target.files[0].name);
    }
});

function updateUploadPlaceholder(filename) {
    const placeholder = uploadArea.querySelector('p');
    placeholder.textContent = `Selected: ${filename}`;
}

// Enhanced Upload Form Submission
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isUploading) return;
    
    const formData = new FormData(uploadForm);
    const uploadProgress = document.querySelector('.upload-progress');
    const filename = document.querySelector('.filename');
    
    if (!videoInput.files.length) {
        showNotification('Please select a video file', 'error');
        return;
    }
    
    try {
        isUploading = true;
        uploadProgress.style.display = 'block';
        filename.textContent = videoInput.files[0].name;
        progressBar.style.width = '0%';
        
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percent = (e.loaded / e.total) * 100;
                progressBar.style.width = percent + '%';
                document.querySelector('.percent').textContent = Math.round(percent) + '%';
            }
        });
        
        xhr.onload = async () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                showNotification('Video uploaded successfully!');
                uploadModal.style.display = 'none';
                uploadForm.reset();
                updateUploadPlaceholder('Drag and drop video files or click to browse');
                await loadVideos(currentCategory);
            } else {
                throw new Error('Upload failed');
            }
        };
        
        xhr.onerror = () => {
            throw new Error('Upload failed');
        };
        
        xhr.open('POST', '/upload');
        xhr.send(formData);
    } catch (error) {
        showNotification('Upload failed. Please try again.', 'error');
    } finally {
        isUploading = false;
    }
});

// Enhanced Video Player
function playVideo(video) {
    currentVideo = video;
    
    videoPlayer.src = video.path;
    videoTitle.textContent = video.title;
    videoDescription.textContent = video.description;
    updateViewCount(video.views);
    updateLikeButton(video.id);
    
    videoPlayerModal.style.display = 'block';
    
    // Update view count on server
    fetch(`/videos/${video.id}/view`).then(response => {
        if (response.ok) return response.json();
    }).then(data => {
        if (data) updateViewCount(data.views);
    });
}

function updateViewCount(views) {
    viewCount.innerHTML = `<i class="fas fa-eye"></i> ${formatViews(views)} views`;
}

function updateLikeButton(videoId) {
    const isLiked = likedVideos.has(videoId);
    likeButton.classList.toggle('active', isLiked);
    likeCount.textContent = currentVideo.likes;
}

// Like Button Handler
likeButton.addEventListener('click', async () => {
    if (!currentVideo || isUploading) return;
    
    try {
        const response = await fetch(`/videos/${currentVideo.id}/like`, {
            method: 'POST'
        });
        
        if (response.ok) {
            const data = await response.json();
            currentVideo.likes = data.likes;
            likedVideos.add(currentVideo.id);
            updateLikeButton(currentVideo.id);
            showNotification('Video liked!');
        }
    } catch (error) {
        showNotification('Failed to like video', 'error');
    }
});

// Utility Functions
function renderVideos(videos) {
    videoGrid.innerHTML = '';
    videos.forEach(video => {
        const videoCard = createVideoCard(video);
        videoGrid.appendChild(videoCard);
    });
}

function formatViews(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M';
    }
    if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K';
    }
    return views.toString();
}

function calculateTimeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    
    return 'Just now';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadVideos(currentCategory);
});

// Ensure modals close when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === uploadModal || e.target === videoPlayerModal) {
        uploadModal.style.display = 'none';
        videoPlayerModal.style.display = 'none';
        if (videoPlayer) videoPlayer.pause();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        uploadModal.style.display = 'none';
        videoPlayerModal.style.display = 'none';
        if (videoPlayer) videoPlayer.pause();
    }
});