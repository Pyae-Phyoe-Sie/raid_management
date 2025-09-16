import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
    apiKey: "AIzaSyDAz7T48Y83KwAiZ7HZRGfxAeDIhMLjUrk",
    authDomain: "raidmanagement-46e2a.firebaseapp.com",
    databaseURL: "https://raidmanagement-46e2a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "raidmanagement-46e2a",
    storageBucket: "raidmanagement-46e2a.firebasestorage.app",
    messagingSenderId: "905659599527",
    appId: "1:905659599527:web:2fa8227230fbc2dd5ba982",
    measurementId: "G-8HG6VTLQLX"
};

const app = initializeApp(firebaseConfig)

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth }