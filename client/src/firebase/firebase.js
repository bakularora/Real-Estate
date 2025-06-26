import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-2866d.firebaseapp.com",
  projectId: "real-estate-2866d",
  storageBucket: "real-estate-2866d.appspot.com",
  messagingSenderId: "121859348047",
  appId: "1:121859348047:web:4aae2b2f5563c454ed3c3a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);