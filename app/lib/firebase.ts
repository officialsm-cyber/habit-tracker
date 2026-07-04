// นำเข้าเครื่องมือจาก Firebase ที่เราติดตั้งไว้
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ⚠️ จุดที่ 1: นำเข้าเครื่องมือสำหรับทำระบบ Login ด้วย Google
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ⚠️ เอา firebaseConfig ของคุณมาวางทับตรงนี้ได้เลยครับ
const firebaseConfig = {
  apiKey: "AIzaSyB6_n46WyyP0XeuVDuTnU4oupFAKgCSLU0",
  authDomain: "habit-tracker-c89ae.firebaseapp.com",
  projectId: "habit-tracker-c89ae",
  storageBucket: "habit-tracker-c89ae.firebasestorage.app",
  messagingSenderId: "406889749540",
  appId: "1:406889749540:web:d69e727f1b8f0228b20cb1",
};

// เช็กก่อนว่ามีแอปถูกสร้างไว้หรือยัง (ป้องกัน Error)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);

// ⚠️ จุดที่ 2: สร้างและส่งออกอุปกรณ์ Login ไปให้ไฟล์อื่นใช้งาน
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
