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
    const authForm = document.getElementById('authForm');
    const formTitle = document.getElementById('formTitle');
    const switchToRegister = document.getElementById('switchToRegister');
  
    let isRegistering = false;
  
    switchToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      isRegistering = !isRegistering;
      if (isRegistering) {
        formTitle.textContent = 'Register';
        switchToRegister.textContent = 'Login';
        authForm.querySelector('button').textContent = 'Register';
      } else {
        formTitle.textContent = 'Login';
        switchToRegister.textContent = 'Register';
        authForm.querySelector('button').textContent = 'Login';
      }
    });
  
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      if (isRegistering) {
        // Register new user
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Registered
            Swal.fire({
              icon: 'success',
              title: 'Registration Successful',
              text: 'You have successfully registered!',
            }).then(() => {
              // Optionally, you can redirect to login page or home page
              window.location.href = 'index.html'; // Redirect to login page
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Registration Failed',
              text: error.message,
            });
          });
      } else {
        // Login existing user
        auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Logged in
            Swal.fire({
              icon: 'success',
              title: 'Login Successful',
              text: 'You have successfully logged in!',
            }).then(() => {
              window.location.href = 'dashboard.html'; // Redirect to home page
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: error.message,
            });
          });
      }
    });
  });