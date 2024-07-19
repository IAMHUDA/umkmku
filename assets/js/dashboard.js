// dashboard.js

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6zN162LNFtTV_NnRpAb0tVZWe8VS2Zqo",
    authDomain: "umkmku-6fcce.firebaseapp.com",
    databaseURL: "https://umkmku-6fcce-default-rtdb.firebaseio.com",
    projectId: "umkmku-6fcce",
    storageBucket: "umkmku-6fcce.appspot.com",
    messagingSenderId: "727965779260",
    appId: "1:727965779260:web:5dabdd7694f8b81c30ca39",
    measurementId: "G-QGJ67SZ6WY"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = '404.html'; // Redirect to 404 page if not authenticated
      }
    });
  });
  