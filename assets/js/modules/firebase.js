import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js'
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCAmDmDM_rYndxnkhIzHBrP6x0JPtDupzU",
  authDomain: "chakki-1ad9d.firebaseapp.com",
  projectId: "chakki-1ad9d",
  storageBucket: "chakki-1ad9d.appspot.com",
  messagingSenderId: "400902058518",
  appId: "1:400902058518:web:ac8d50e36db35a3ed63b37",
  measurementId: "G-D9548MQV0C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };