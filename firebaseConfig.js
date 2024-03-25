import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNDv6IeaeZa__3lqgGbn0_45wB8a0dmc8",
  authDomain: "alkoholegen.firebaseapp.com",
  projectId: "alkoholegen",
  storageBucket: "alkoholegen.appspot.com",
  messagingSenderId: "833708770632",
  appId: "1:833708770632:web:6601555d140febc8ea9f7d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);