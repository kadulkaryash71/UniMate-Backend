// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6RHzPt6xij6Yxr_MWqGBU3wrEnyv6CG0",
  authDomain: "urpgcommunity.firebaseapp.com",
  databaseURL: "https://urpgcommunity-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "urpgcommunity",
  storageBucket: "urpgcommunity.appspot.com",
  messagingSenderId: "990593532181",
  appId: "1:990593532181:web:fda96396f8b992adfb691c",
  measurementId: "G-YG4VFF60SS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const storage = getStorage(app);

module.exports = { app, storage }