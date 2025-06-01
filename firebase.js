// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDI2DIxQ_L5xhvceP7EByiOCw9W_QR00k8",
  authDomain: "the-nixus.firebaseapp.com",
  projectId: "the-nixus",
  storageBucket: "the-nixus.firebasestorage.app",
  messagingSenderId: "1057215143034",
  appId: "1:1057215143034:web:92a698a4a04a82ed002fc3",
  measurementId: "G-1HDWS2R3QN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // <- Firestore database instance

export { db };
