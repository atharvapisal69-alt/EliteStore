import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZmlCW64x6WVY7CaDslDMttEMUG9itHXA",
  authDomain: "elitestore-4e337.firebaseapp.com",
  projectId: "elitestore-4e337",
  storageBucket: "elitestore-4e337.firebasestorage.app",
  messagingSenderId: "492370174490",
  appId: "1:492370174490:web:d5c954e5c17627aa0f67a3",
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

export const auth = getAuth(app);

export const db = getFirestore(app);

export { app };
