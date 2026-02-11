// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASxUU9n5V6tW6tArQXYcsQj5J6U1oTdg4",
  authDomain: "echoshore-18def.firebaseapp.com",
  projectId: "echoshore-18def",
  storageBucket: "echoshore-18def.firebasestorage.app",
  messagingSenderId: "135030499248",
  appId: "1:135030499248:web:706b48f4cfeae96b0a9875",
  measurementId: "G-5HL6V831LN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);