// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDVoJv1C32wJ0yBZ3DpO8gnrI1EgTKJnA8",
  authDomain: "cost2go-cf0b2.firebaseapp.com",
  projectId: "cost2go-cf0b2",
  storageBucket: "cost2go-cf0b2.firebasestorage.app",
  messagingSenderId: "800760917457",
  appId: "1:800760917457:web:1026471fdedbb800c6c4f0",
  measurementId: "G-XJCCKWGE0P",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export the auth object
export const auth = getAuth(app);
