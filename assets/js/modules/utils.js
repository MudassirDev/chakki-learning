import { auth, db } from "./firebase.js"
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { deleteDoc, setDoc, doc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

export const checkUser = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User is signed in");
            window.userLoggedIn = true;
            window.user = user;
        } else {
            console.log("No user is signed in.");
            window.userLoggedIn = false;
            if (window.location.pathname != "/chakki-learning/" && window.location.pathname != "/chakki-learning/pages/login.html") {
                window.location.href = "/chakki-learning/pages/login.html"
            }
        }
    });
}

export const initLogout = () => {
    const logoutBtn = document.getElementById('logoutBtn');

    logoutBtn.addEventListener('click', function() {
        signOut(auth).then(() => {
            window.location.href = '/chakki-learning/';
        }).catch((error) => {
            console.log(error)
        });
    })
}

export const saveDoc = async (database, document, data) => {
    try {
        await setDoc(doc(db, database, document), data);
    } catch (error) {
        console.error(error)
    }
}

export const deleteDocument = async (database, document) => {
    try {
        await deleteDoc(doc(db, database, document));
    } catch (error) {
        console.error(error);
    }
}

export class DataCache {
    constructor() {
      this.orders = null;
      this.customers = null;
    }
  
    async fetchCollection(collectionName) {
      const snapshot = await getDocs(collection(db, collectionName));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  
    async getOrders() {
      if (!this.orders) {
        console.log("Fetching Orders from Firebase...");
        this.orders = await this.fetchCollection("Orders");
      } else {
        console.log("Using cached Orders data.");
      }
      return this.orders;
    }
  
    async getCustomers() {
      if (!this.customers) {
        console.log("Fetching Customers from Firebase...");
        this.customers = await this.fetchCollection("Customers");
      } else {
        console.log("Using cached Customers data.");
      }
      return this.customers;
    }

    setOrders(newOrders) {
        this.orders = newOrders;
    }

    setCustomers(newData) {
        this.customers = newData;
    }
  
    clearCache() {
      this.orders = null;
      this.customers = null;
      console.log("Cache cleared.");
    }
}