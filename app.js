// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdbZumQNpD_crFlofVf2yzWUoaOZS0ZFM",
    authDomain: "hack-392ff.firebaseapp.com",
    projectId: "hack-392ff",
    databaseURL: "https://hack-392ff-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: "hack-392ff.firebasestorage.app",
    messagingSenderId: "927440063077",
    appId: "1:927440063077:web:cb46698aa0c16d35d3148c",
    measurementId: "G-NGG3X7ZK61"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let videoStream;
let isRecording = false;

const statusText = document.getElementById('status');

// Function for voice feedback
function speakFeedback(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
}

// Create container for video and buttons
const container = document.createElement('div');
container.style.position = 'fixed';
container.style.top = '0';
container.style.left = '0';
container.style.width = '100%';
container.style.height = '100%';
container.style.display = 'flex';
container.style.flexDirection = 'column';
container.style.alignItems = 'center';
container.style.backgroundColor = '#000';
container.style.zIndex = '1000';

// Add video element with fixed dimensions
const videoElement = document.createElement('video');
videoElement.style.width = '100%';
videoElement.style.height = '100%';
videoElement.style.objectFit = 'cover';
videoElement.setAttribute('playsinline', true);
videoElement.setAttribute('autoplay', true);
container.appendChild(videoElement);

// Create stop button with improved mobile visibility
const stopButton = document.createElement('button');
stopButton.textContent = 'STOP';
stopButton.style.position = 'fixed';
stopButton.style.bottom = '40px';
stopButton.style.left = '50%';
stopButton.style.transform = 'translateX(-50%)';
stopButton.style.zIndex = '9999';
stopButton.style.padding = '20px 40px';
stopButton.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
stopButton.style.color = 'white';
stopButton.style.border = 'none';
stopButton.style.borderRadius = '30px';
stopButton.style.fontSize = '24px';
stopButton.style.fontWeight = 'bold';
stopButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
stopButton.style.WebkitTapHighlightColor = 'transparent';
stopButton.style.touchAction = 'manipulation';
stopButton.style.userSelect = 'none';

// Add touch feedback for stop button
stopButton.addEventListener('touchstart', () => {
    stopButton.style.backgroundColor = 'rgba(200, 0, 0, 0.9)';
    stopButton.style.transform = 'translateX(-50%) scale(0.95)';
});

stopButton.addEventListener('touchend', () => {
    stopButton.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    stopButton.style.transform = 'translateX(-50%) scale(1)';
});

async function startCamera() {
    if (isRecording) return;
    
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: window.innerWidth },
                height: { ideal: window.innerHeight }
            } 
        });
        
        document.body.appendChild(container);
        container.appendChild(stopButton);
        videoElement.srcObject = videoStream;
        await videoElement.play();
        isRecording = true;

        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');

        // Modified touch handler for video element
        videoElement.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if (e.target !== stopButton) {
                speakFeedback('Capturing image');
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                uploadImage(imageData);
            }
        });

        // Add click handler for desktop testing
        videoElement.addEventListener('click', function(e) {
            if (e.target !== stopButton) {
                speakFeedback('Capturing image');
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                uploadImage(imageData);
            }
        });

        speakFeedback('Camera active. Tap anywhere to capture image.');

    } catch (error) {
        console.error('Camera access error:', error);
        speakFeedback('Camera access failed. Please try again.');
        isRecording = false;
    }
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        isRecording = false;
        if (container.parentNode) {
            container.parentNode.removeChild(container);
        }
        speakFeedback('Camera stopped. Tap to start again.');
    }
}

function uploadImage(imageData) {
    speakFeedback('Starting image upload');
    const apiKey = '63843b305acfadfbd987e5570952fe17';
    const base64Image = imageData.split(',')[1];

    const formData = new FormData();
    formData.append('image', base64Image);

    speakFeedback('Sending to server');
    fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        speakFeedback('Response received');
        return response.json();
    })
    .then(result => {
        if(result.data && result.data.url) {
            speakFeedback('Image uploaded successfully');
            saveToDatabase(result.data.url);
        }
    })
    .catch(error => {
        speakFeedback('Upload failed. Please try again');
        console.error('Upload failed:', error);
    });
}

function saveToDatabase(imageUrl) {
    const imagesRef = database.ref('images');
    imagesRef.push({
        url: imageUrl,
        timestamp: Date.now()
    }).then(() => {
        speakFeedback('Image saved to database');
    }).catch(error => {
        speakFeedback('Database save failed');
        console.error('Database save failed:', error);
    });
}

// Event listeners
document.body.addEventListener('touchstart', (e) => {
    if (!isRecording && e.target !== stopButton) {
        speakFeedback('Starting camera');
        startCamera();
    }
});

document.body.addEventListener('click', (e) => {
    if (!isRecording && e.target !== stopButton) {
        speakFeedback('Starting camera');
        startCamera();
    }
});

stopButton.addEventListener('click', (e) => {
    e.stopPropagation();
    stopCamera();
});

// Handle orientation changes
window.addEventListener('resize', () => {
    if (isRecording) {
        stopCamera();
        startCamera();
    }
});

// Initial instruction
speakFeedback('Welcome to Coin Detection Assistant. Tap anywhere to start the camera.');
