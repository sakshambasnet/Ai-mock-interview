// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyDl4jdPl2cIVW-bfZKeQ9dj_e9ccmmBQic",
    authDomain: "jobbuddy-93ea8.firebaseapp.com",
    projectId: "jobbuddy-93ea8",
    storageBucket: "jobbuddy-93ea8.firebasestorage.app",
    messagingSenderId: "32978240265",
    appId: "1:32978240265:web:bcc4bc9f5cfb56761289d8",
    measurementId: "G-H71BWJH8MM"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig): getApp();

export const  auth = getAuth(app);
const db = getFirestore(app);