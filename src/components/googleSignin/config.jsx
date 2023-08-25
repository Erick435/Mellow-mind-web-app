// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_DOMAIN_ID,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_PROJECT_STORAGE,
    messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER,
    appId: process.env.REACT_APP_PROJECT_APP_ID,
    measurementId: process.env.REACT_APP_MEASURE_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app); // Note the removal of `export const` here

export { auth, provider, db }; // Add `db` to your export here