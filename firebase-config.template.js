/**
 * Firebase Configuration Template
 * Philomae's Legacy Family Reunion
 * 
 * SETUP INSTRUCTIONS:
 * 1. Copy this file to 'firebase-config.js'
 * 2. Replace 'YOUR_API_KEY_HERE' with your actual Firebase API key
 * 3. Verify other values match your Firebase project settings
 * 
 * SECURITY NOTE: 
 * - Never commit firebase-config.js to version control
 * - Keep your API key secure and regenerate if exposed
 * - firebase-config.js is in .gitignore for security
 */

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE", // ⚠️  REPLACE with your Firebase API key
  authDomain: "philomae-legacy-reunion.firebaseapp.com",
  databaseURL: "https://philomae-legacy-reunion-default-rtdb.firebaseio.com",
  projectId: "philomae-legacy-reunion",
  storageBucket: "philomae-legacy-reunion.firebasestorage.app",
  messagingSenderId: "950404873016",
  appId: "1:950404873016:web:aaa6acc09bf1032a5adfcd"
};

// Initialize Firebase
let database = null;
let storage = null;

try {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    storage = firebase.storage();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    console.log('Please check your Firebase credentials in firebase-config.js');
}

// Export database and storage references for use in app.js
window.firebaseDB = database;
window.firebaseStorage = storage;