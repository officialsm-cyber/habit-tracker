"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import HabitCard from "./components/HabitCard";
import HabitForm from "./components/HabitForm";
import Header from "./components/Header";
import ThemeToggle from "./components/ThemeToggle";
import { AnimatePresence } from "framer-motion";

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
  userId?: string;
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      return;
    }
    const q = query(collection(db, "habits"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Habit[];

      habitsData.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setHabits(habitsData);
    });
    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

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
    if (!inputValue.trim() || !user) return;
    const newHabit = {
      title: inputValue,
      category: "New Task",
      theme:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:shadow-blue-500/10",
      completed: false,
      createdAt: new Date().toISOString(),
      userId: user.uid,
    };
    setInputValue("");
    await addDoc(collection(db, "habits"), newHabit);
  };

  const deleteHabit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteDoc(doc(db, "habits", id));
  };

  if (!isMounted) return null;

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors duration-500 flex flex-col items-center justify-center p-6">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <div className="max-w-md w-full bg-white dark:bg-gray-900/50 p-10 rounded-3xl border border-gray-200 dark:border-gray-800 text-center backdrop-blur-md shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-emerald-500 dark:text-emerald-400"
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Premium Habit
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            เข้าสู่ระบบเพื่อจัดการเป้าหมายของคุณ
          </p>
          <button
            onClick={handleLogin}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-bold py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-lg"
          >
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

  return (
    <main className="min-h-screen w-full bg-gray-50 dark:bg-[#121212] transition-colors duration-500 px-6 md:px-12 lg:px-16 py-6 md:py-8 relative">
      {/* กล่องรวมปุ่มมุมขวาบน */}
      <div className="absolute top-6 right-6 md:top-10 md:right-16 flex items-center gap-3 z-50">
        <ThemeToggle />

        {/* ⚠️ ปุ่มประตูมิติไปหน้า Dashboard ที่เราเพิ่มเข้ามาใหม่ */}
        <Link
          href="/dashboard"
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-white bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-500 dark:hover:bg-blue-500/30 px-4 py-2 rounded-xl transition-colors border border-blue-200 dark:border-blue-500/30 hover:border-blue-500 flex items-center gap-2 shadow-sm font-bold"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          ดูสถิติ
        </Link>

        <button
          onClick={handleLogout}
          className="text-sm text-gray-700 dark:text-gray-400 hover:text-red-600 dark:hover:text-white bg-white dark:bg-gray-800/50 hover:bg-red-50 dark:hover:bg-red-500/20 px-4 py-2 rounded-xl transition-colors border border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-500/50 flex items-center gap-2 shadow-sm"
        >
          <img
            src={user.photoURL || ""}
            alt="Profile"
            className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700"
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
