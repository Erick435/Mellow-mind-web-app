// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth"
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDFmAGsMgXN8c3E3UrG6DwJW-mc97CwB-E",
    authDomain: "mellow-mind-c0958.firebaseapp.com",
    projectId: "mellow-mind-c0958",
    storageBucket: "mellow-mind-c0958.appspot.com",
    messagingSenderId: "293295245938",
    appId: "1:293295245938:web:8def012fff2e71a02990eb",
    measurementId: "G-WPL0LLGMJ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// export const db = getFirestore();

export {auth, provider};
