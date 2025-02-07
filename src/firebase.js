import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPsvquyGAzgwJGk76cCPREMmCb8eRGAfI",
  authDomain: "faculty-task-management.firebaseapp.com",
  projectId: "faculty-task-management",
  storageBucket: "faculty-task-management.firebasestorage.app",
  messagingSenderId: "418773905177",
  appId: "1:418773905177:web:02bb59396934ae76d51f88",
  measurementId: "G-BVYYV22NKF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);