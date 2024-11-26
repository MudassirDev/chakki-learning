import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js'
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyALfhkR7cRDhKP5E5BgR8UeNJ_9gjv44s8",
    authDomain: "chakki-learning.firebaseapp.com",
    projectId: "chakki-learning",
    storageBucket: "chakki-learning.appspot.com",
    messagingSenderId: "1011286300235",
    appId: "1:1011286300235:web:d0c5577eace92a3a9f5fce",
    measurementId: "G-8N10L72SL5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };