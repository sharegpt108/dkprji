// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBELYOjaamWhNt0gwpJnkajmgB5W90bDm8",
  authDomain: "udgaarlivepledge.firebaseapp.com",
  databaseURL: "https://udgaarlivepledge-default-rtdb.firebaseio.com",
  projectId: "udgaarlivepledge",
  storageBucket: "udgaarlivepledge.firebasestorage.app",
  messagingSenderId: "989912697489",
  appId: "1:989912697489:web:13f389d028ac47db4c0d30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
