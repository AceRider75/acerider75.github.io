// Firebase configuration
const firebaseConfig = {
    // Your Firebase configuration here
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const storageRef = storage.ref();

let recognition;
let isListening = false;
const toggleButton = document.getElementById('toggleButton');
const statusText = document.getElementById('status');

// Initialize speech recognition
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

    if (command === 'detect coin' || command === 'take picture') {
        takePicture();
    } else if (command === 'stop') {
        stopListening();
    }
}

function handleSpeechError(event) {
    console.error('Speech recognition error:', event.error);
    statusText.textContent = 'Error: ' + event.error;
}

function startListening() {
    recognition.start();
    isListening = true;
    statusText.textContent = 'Listening... Say "detect coin" or "take picture"';
    toggleButton.textContent = 'Stop';
}

function stopListening() {
    recognition.stop();
    isListening = false;
    statusText.textContent = 'Tap anywhere to start';
    toggleButton.textContent = 'Start';
}

function takePicture() {
    statusText.textContent = 'Taking picture...';
    
    // Simulating camera capture and upload
    setTimeout(() => {
        const imageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigD//2Q==';
        uploadImage(imageData);
    }, 1000);
}

function uploadImage(imageData) {
    const imageName = 'coin_' + Date.now() + '.jpg';
    const imageRef = storageRef.child(imageName);

    imageRef.putString(imageData, 'data_url').then((snapshot) => {
        statusText.textContent = 'Image uploaded. Analyzing...';
        // Simulating coin detection result
        setTimeout(() => {
            const result = 'This is a 1 rupee coin';
            speak(result);
        }, 2000);
    }).catch((error) => {
        console.error('Upload failed:', error);
        statusText.textContent = 'Upload failed. Please try again.';
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
