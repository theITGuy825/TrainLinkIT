// Import the necessary functions from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { getFirestore, collection, onSnapshot } from "firebase/firestore"; // Import Firestore
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIkiZ19Uav0uXpgkt3H2vNx0qjkYGC5Rw",
  authDomain: "trainlinkit-c98b9.firebaseapp.com",
  projectId: "trainlinkit-c98b9",
  storageBucket: "trainlinkit-c98b9.firebasestorage.app",
  messagingSenderId: "335547332391",
  appId: "1:335547332391:web:134b8789ec97f1c0badb02",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Optional, if you are using Analytics

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app); // Firebase authentication instance
const db = getFirestore(app); // Firestore instance

// Export the services to be used in other files
export { auth, db, analytics, collection, onSnapshot };
