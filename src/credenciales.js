// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4DBS7TCoaD9xBNXVRp8nD3SPLafJDksw",
  authDomain: "pwaaa-login.firebaseapp.com",
  databaseURL:"https://pwaaa-login-default-rtdb.firebaseio.com/",
  projectId: "pwaaa-login",
  storageBucket: "pwaaa-login.firebasestorage.app",
  messagingSenderId: "547084784418",
  appId: "1:547084784418:web:de91537313efe1b7084b7b"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;