// src/lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM4FRdkwmk00sJxvbAiyHNTKv4e6PZK_o",
  authDomain: "mityczny-pionek.firebaseapp.com",
  projectId: "mityczny-pionek",
  storageBucket: "mityczny-pionek.firebasestorage.app",
  messagingSenderId: "921330231514",
  appId: "1:921330231514:web:c81c3baca74128f3c85de3"
};

// Initialize Firebase (zabezpieczenie dla Next.js przed podwójną inicjalizacją)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);