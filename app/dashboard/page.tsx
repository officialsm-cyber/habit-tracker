"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

import { db, auth } from '../lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

interface Habit {
  id: string;
  title: string;
  completed: boolean;
}

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. ดักจับสถานะ Login
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setIsLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. ดึงข้อมูลจาก Cloud มาคำนวณอย่างแม่นยำ
  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, 'habits'), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Habit[];
      setHabits(habitsData);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [user]);

  // หน้าจอกำลังโหลด
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // ป้องกันการเข้าถึงโดยไม่ได้ Login
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#121212] p-6 transition-colors duration-500">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">พื้นที่ส่วนตัว: กรุณาเข้าสู่ระบบ</h1>
        <Link href="/" className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors">
          กลับหน้าหลัก
        </Link>
      </div>
    );
  }

  // 🧮 คณิตศาสตร์วิเคราะห์สถิติ (แม่นยำ 100%)
  const totalHabits = habits.length;
  const completedHabits = habits.filter(h => h.completed).length;
  const pendingHabits = totalHabits - completedHabits;
  // ป้องกัน Error หารด้วยศูนย์ในกรณีที่ยังไม่มีข้อมูล
  const completionRate = totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

  return (
    <main className="min-h-screen w-full bg-gray-50 dark:bg-[#121212] transition-colors duration-500 px-6 md:px-12 lg:px-16 py-6 md:py-8 relative">
      {/* แผงควบคุมมุมขวาบน */}
      <div className="absolute top-6 right-6 md:top-10 md:right-16 flex items-center gap-3 z-50">
        <ThemeToggle />
        <Link 
          href="/"
          className="text-sm text-gray-700 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-gray-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 px-4 py-2 rounded-xl transition-colors border border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-500/50 flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          หน้าหลัก
        </Link>
      </div>

      <div className="mt-16 md:mt-0 mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          วิเคราะห์สถิติ 📊
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ภาพรวมความก้าวหน้าและเป้าหมายทั้งหมดของคุณ
        </p>
      </div>

      {/* กล่องแสดงผลสถิติ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between"
        >
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold tracking-wider mb-4 uppercase">อัตราความสำเร็จ</h3>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-bold text-emerald-500">{completionRate}%</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between"
        >
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold tracking-wider mb-4 uppercase">เป้าหมายทั้งหมด</h3>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-bold text-blue-500">{totalHabits}</span>
            <span className="text-gray-500 dark:text-gray-400 mb-2 font-medium">รายการ</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between"
        >
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold tracking-wider mb-4 uppercase">ทำสำเร็จแล้ว</h3>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-bold text-emerald-500">{completedHabits}</span>
            <span className="text-gray-500 dark:text-gray-400 mb-2 font-medium">รายการ</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between"
        >
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold tracking-wider mb-4 uppercase">กำลังดำเนินการ</h3>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-bold text-amber-500">{pendingHabits}</span>
            <span className="text-gray-500 dark:text-gray-400 mb-2 font-medium">รายการ</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}