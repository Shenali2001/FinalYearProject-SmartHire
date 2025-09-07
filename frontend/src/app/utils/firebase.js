import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDbimiMTcR29IJ12Q119CmL-rWDoBjmTuI",
  authDomain: "smarthire-ai-interview.firebaseapp.com",
  projectId: "smarthire-ai-interview",
  storageBucket: "smarthire-ai-interview.firebasestorage.app",
  messagingSenderId: "907248696498",
  appId: "1:907248696498:web:11233f6b478c9619549dab",
  measurementId: "G-5F3F9TTEGP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);