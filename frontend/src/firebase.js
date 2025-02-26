// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuINNc2xoCiJ1PNqw7ZPfKX24rncq5zlg",
  authDomain: "trainlinkit.firebaseapp.com",
  projectId: "trainlinkit",
  storageBucket: "trainlinkit.firebasestorage.app",
  messagingSenderId: "303568254310",
  appId: "1:303568254310:web:baedc4265c7534db7bc4a7",
  measurementId: "G-FNY0NM8JHS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

