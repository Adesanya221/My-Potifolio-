import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5ZMwAqMKjoMmdiNmP-H5aae4UvQ8kVlo",
  authDomain: "my-potifolio-95cf0.firebaseapp.com",
  projectId: "my-potifolio-95cf0",
  storageBucket: "my-potifolio-95cf0.firebasestorage.app",
  messagingSenderId: "721445923547",
  appId: "1:721445923547:web:37d8858c111c051a0dbafe",
  measurementId: "G-L0J8ZSED99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { db, auth, storage, analytics }; 