"use client";

import React, { useState, useEffect } from "react";
import HabitCard from "./components/HabitCard";
import HabitForm from "./components/HabitForm";
import Header from "./components/Header";
import ThemeToggle from "./components/ThemeToggle"; // ⚠️ เพิ่มบรรทัดนี้
import { AnimatePresence } from "framer-motion";

// นำเข้าเครื่องมือ Database
import { db } from "./lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

// ⚠️ นำเข้าเครื่องมือ Auth (ระบบ Login) ที่เราเพิ่งสร้าง
import { auth, googleProvider } from "./lib/firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

interface Habit {
  id: string;
  title: string;
  category: string;
  theme: string;
  completed: boolean;
  createdAt?: string;
  userId?: string; // เพิ่มฟิลด์สำหรับเก็บว่าใครเป็นเจ้าของข้อมูล
}

export default function Home() {
  const today = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [habits, setHabits] = useState<Habit[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // State สำหรับเก็บข้อมูลผู้ใช้งานที่ Login เข้ามา
  const [user, setUser] = useState<User | null>(null);

  // 1. ระบบดักจับสถานะ Login (ทำทันทีที่เปิดเว็บ)
  useEffect(() => {
    setIsMounted(true);
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // ถ้า Login แล้ว currentUser จะมีข้อมูล, ถ้ายัง จะเป็น null
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. ระบบดึงข้อมูลจาก Cloud (ดึงเฉพาะข้อมูลของ user คนนี้เท่านั้น)
  useEffect(() => {
    // ถ้ายังไม่ Login ไม่ต้องไปดึงข้อมูลให้เปลืองโควต้า
    if (!user) {
      setHabits([]);
      return;
    }

    // สั่งค้นหาข้อมูลเฉพาะที่มี userId ตรงกับคนที่ Login
    const q = query(collection(db, "habits"), where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Habit[];

      // เรียงลำดับจากใหม่ไปเก่า (ทำฝั่งคอมพิวเตอร์เรา เพื่อป้องกัน Error ในระบบ Cloud)
      habitsData.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setHabits(habitsData);
    });

    return () => unsubscribe();
  }, [user]); // [user] หมายความว่า ถ้าสลับบัญชี ให้ดึงข้อมูลใหม่ทันที

  // ฟังก์ชันล็อกอิน
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // ฟังก์ชันออกจากระบบ
  const handleLogout = async () => {
    await signOut(auth);
  };

  const toggleHabit = async (id: string) => {
    const habitToUpdate = habits.find((h) => h.id === id);
    if (!habitToUpdate) return;
    const habitRef = doc(db, "habits", id);
    await updateDoc(habitRef, { completed: !habitToUpdate.completed });
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return; // ถ้าไม่ Login จะเพิ่มข้อมูลไม่ได้

    const newHabit = {
      title: inputValue,
      category: "New Task",
      theme:
        "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:shadow-blue-500/10",
      completed: false,
      createdAt: new Date().toISOString(),
      userId: user.uid, // ⚠️ ประทับตราว่าข้อมูลนี้ "เป็นของฉัน"
    };

    setInputValue("");
    await addDoc(collection(db, "habits"), newHabit);
  };

  const deleteHabit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteDoc(doc(db, "habits", id));
  };

  if (!isMounted) return null;

  // --------------------------------------------------------
  // UI หน้าต่างตอน "ยังไม่ได้ Login"
  // --------------------------------------------------------
  if (!user) {
    return (
      <main className="min-h-screen bg-[#121212] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/90 dark:bg-gray-900/50 p-10 rounded-3xl border border-gray-200 dark:border-gray-800 text-center backdrop-blur-md shadow-2xl">
          {" "}
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Premium Habit</h1>
          <p className="text-gray-400 mb-8">
            เข้าสู่ระบบเพื่อจัดการเป้าหมายของคุณ
          </p>
          <button
            onClick={handleLogin}
            className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>
      </main>
    );
  }

  const completedCount = habits.filter((habit) => habit.completed).length;
  const progressPercentage =
    habits.length === 0
      ? 0
      : Math.round((completedCount / habits.length) * 100);

  // --------------------------------------------------------
  // UI หน้าหลัก (เมื่อ Login แล้ว)
  // --------------------------------------------------------
  return (
    <main className="min-h-screen w-full px-6 md:px-12 lg:px-16 py-6 md:py-8 relative">
      {/* ⚠️ มุมขวาบน: กล่องรวมปุ่มสลับธีมและปุ่ม Logout */}
      <div className="absolute top-6 right-6 md:top-10 md:right-16 flex items-center gap-3 z-50">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="text-sm text-gray-700 dark:text-gray-400 hover:text-red-600 dark:hover:text-white bg-white dark:bg-gray-800/50 hover:bg-red-50 dark:hover:bg-red-500/20 px-4 py-2 rounded-xl transition-colors border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-500/50 flex items-center gap-2 shadow-sm"
        >
          <img
            src={user.photoURL || ""}
            alt="Profile"
            className="w-6 h-6 rounded-full"
          />
          ออกจากระบบ
        </button>
      </div>

      <Header today={today} progressPercentage={progressPercentage} />
      <HabitForm
        inputValue={inputValue}
        setInputValue={setInputValue}
        onAddHabit={handleAddHabit}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={toggleHabit}
              onDelete={deleteHabit}
            />
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}
