// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdbZumQNpD_crFlofVf2yzWUoaOZS0ZFM",
  authDomain: "hack-392ff.firebaseapp.com",
  projectId: "hack-392ff",
  databaseURL: "https://hack-392ff-default-rtdb.firebaseio.com", // Add this line
  storageBucket: "hack-392ff.firebasestorage.app",
  messagingSenderId: "927440063077",
  appId: "1:927440063077:web:cb46698aa0c16d35d3148c",
  measurementId: "G-NGG3X7ZK61"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

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
    videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
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
          const imageData = canvas.toDataURL('image/jpeg');
          uploadToImgBB(imageData);
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

function uploadToImgBB(imageData) {
  const apiKey = '63843b305acfadfbd987e5570952fe17'; // Replace with your actual ImgBB API key

  const formData = new FormData();
  formData.append('image', imageData.split(',')[1]);

  fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(result => {
    console.log('Image uploaded to ImgBB:', result.data.url);
    saveUrlToFirebase(result.data.url);
  })
  .catch(error => {
    console.error('Error uploading to ImgBB:', error);
  });
}

function saveUrlToFirebase(imageUrl) {
  const dbRef = database.ref('images');
  dbRef.push({
    url: imageUrl,
    timestamp: firebase.database.ServerValue.TIMESTAMP
  });
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
  statusText.textContent = text;
}

initSpeechRecognition();

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
