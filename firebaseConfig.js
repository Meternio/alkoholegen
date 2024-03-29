import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

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

// Initialize Firebase Auth with AsyncStorage on mobile platforms
export const auth = Platform.OS === 'web' ? getAuth(app) : initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});