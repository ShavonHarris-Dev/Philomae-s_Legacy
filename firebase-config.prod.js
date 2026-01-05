/**
 * Firebase Configuration for Production
 * Production-safe configuration
 */

// Your web app's Firebase configuration
// Note: These are safe to expose in client-side code for Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAvm3DH3IApnayJfj-1FxbdDdSNMlcfN20", // Safe to expose for Firebase web apps
  authDomain: "philomae-legacy-reunion.firebaseapp.com",
  databaseURL: "https://philomae-legacy-reunion-default-rtdb.firebaseio.com",
  projectId: "philomae-legacy-reunion",
  storageBucket: "philomae-legacy-reunion.firebasestorage.app",
  messagingSenderId: "950404873016",
  appId: "1:950404873016:web:aaa6acc09bf1032a5adfcd"
};

// Initialize Firebase (using legacy CDN syntax that matches your HTML)
let database = null;
let storage = null;

try {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    storage = firebase.storage();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    console.log('Please check your Firebase credentials');
}

// Export database and storage references for use in app.js
window.firebaseDB = database;
window.firebaseStorage = storage;