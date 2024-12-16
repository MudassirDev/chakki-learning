import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js'
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9FE-wZtrZt9XFfcP4Sdy7N1wU1Joyo6A",
  authDomain: "chakki-ddfff.firebaseapp.com",
  projectId: "chakki-ddfff",
  storageBucket: "chakki-ddfff.firebasestorage.app",
  messagingSenderId: "992359809479",
  appId: "1:992359809479:web:58223a23188074de2b59e2",
  measurementId: "G-ZGLD1S5SWG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };