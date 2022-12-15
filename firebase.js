// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "twitter-v4-bfaa0.firebaseapp.com",
    projectId: "twitter-v4-bfaa0",
    storageBucket: "twitter-v4-bfaa0.appspot.com",
    messagingSenderId: "1052852354798",
    appId: "1:1052852354798:web:f690413919e2b33b047dff",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
export { app, db, storage };
