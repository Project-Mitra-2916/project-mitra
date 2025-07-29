import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore import

const firebaseConfig = {
  apiKey: "AIzaSyAYhqQYfTgpY7M67GRebDPBadL-xH8TRqQ",
  authDomain: "projectmitra-2916.firebaseapp.com",
  projectId: "projectmitra-2916",
  storageBucket: "projectmitra-2916.firebasestorage.app",
  messagingSenderId: "728027587396",
  appId: "1:728027587396:web:476611b633e3f0a3a02d11"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Export Firestore
