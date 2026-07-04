// นำเข้าเครื่องมือจาก Firebase ที่เราติดตั้งไว้
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ⚠️ เอา firebaseConfig ของคุณมาวางทับตรงนี้ได้เลยครับ
const firebaseConfig = {
  apiKey: "AIzaSyB6_n46WyyP0XeuVDuTnU4oupFAKgCSLU0",
  authDomain: "habit-tracker-c89ae.firebaseapp.com",
  projectId: "habit-tracker-c89ae",
  storageBucket: "habit-tracker-c89ae.firebasestorage.app",
  messagingSenderId: "406889749540",
  appId: "1:406889749540:web:d69e727f1b8f0228b20cb1"
};

// Logic ป้องกันบั๊ก: เช็กก่อนว่ามีแอปถูกสร้างไว้หรือยัง ถ้ายังให้สร้างใหม่ (ป้องกัน Error ตอน Next.js รีเฟรชหน้าเว็บ)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ส่งออกตัวแปร db (ฐานข้อมูล) เพื่อให้ไฟล์อื่นเอาไปใช้ดึง/เขียนข้อมูลได้
export const db = getFirestore(app);