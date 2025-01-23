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
const db = firebase.database();

let recognition;
let isListening = false;
let videoStream;
let frameCount = 0;
const FRAMES_BEFORE_CAPTURE = 50;

const toggleButton = document.getElementById('toggleButton');
const statusText = document.getElementById('status');

function initSpeechRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = handleSpeechResult;
    recognition.onerror = handleSpeechError;
}

function handleSpeechResult(event) {
    const last = event.results.length - 1;
    const command = event.results[last][0].transcript.trim().toLowerCase();

    if (command === 'start detection') {
        startCamera();
    } else if (command === 'stop detection') {
        stopCamera();
    }
}

function handleSpeechError(event) {
    console.error('Speech recognition error:', event.error);
    statusText.textContent = 'Error: ' + event.error;
}

function startListening() {
    recognition.start();
    isListening = true;
    statusText.textContent = 'Listening... Say "start detection" to begin';
    toggleButton.textContent = 'Stop Listening';
}

function stopListening() {
    recognition.stop();
    isListening = false;
    statusText.textContent = 'Tap anywhere to start listening';
    toggleButton.textContent = 'Start Listening';
}

async function startCamera() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        const video = document.createElement('video');
        video.srcObject = videoStream;
        video.play();

        video.addEventListener('loadedmetadata', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            function captureFrame() {
                if (frameCount >= FRAMES_BEFORE_CAPTURE) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = canvas.toDataURL('image/jpeg', 0.8);
                    uploadImage(imageData);
                    frameCount = 0;
                } else {
                    frameCount++;
                }
                requestAnimationFrame(captureFrame);
            }

            captureFrame();
        });

        statusText.textContent = 'Camera started. Capturing images every 50 frames.';
    } catch (error) {
        console.error('Error accessing camera:', error);
        statusText.textContent = 'Error accessing camera. Please try again.';
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
    const apiKey = 'YOUR_IMGBB_API_KEY'; // Replace with your ImgBB API key
    const base64Image = imageData.split(',')[1];

    const formData = new FormData();
    formData.append('image', base64Image);

    fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        saveToDatabase(result.data.url);
    })
    .catch(error => {
        console.error('Upload failed:', error);
        statusText.textContent = 'Upload failed. Please try again.';
    });
}

function saveToDatabase(imageUrl) {
    const imagesRef = db.ref('images');
    imagesRef.push({
        url: imageUrl,
        timestamp: Date.now()
    });
}

function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    statusText.textContent = text;
}

// Initialize the app
initSpeechRecognition();

// Event listeners
toggleButton.addEventListener('click', () => {
    if (isListening) {
        stopListening();
    } else {
        startListening();
    }
});

document.body.addEventListener('touchstart', () => {
    if (!isListening) {
        startListening();
    }
});
