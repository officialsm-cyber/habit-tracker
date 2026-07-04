"use client";

import React, { useState, useEffect } from "react";
import HabitCard from "./components/HabitCard";
import HabitForm from "./components/HabitForm";
import Header from "./components/Header";
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
  orderBy,
} from "firebase/firestore";

interface Habit {
  id: string;
  title: string;
  category: string;
  theme: string;
  completed: boolean;
  createdAt?: string;
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

  useEffect(() => {
    setIsMounted(true);
    const q = query(collection(db, "habits"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const habitsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Habit[];
      setHabits(habitsData);
    });

    return () => unsubscribe();
  }, []);

  const toggleHabit = async (id: string) => {
    const habitToUpdate = habits.find((h) => h.id === id);
    if (!habitToUpdate) return;

    const habitRef = doc(db, "habits", id);
    await updateDoc(habitRef, { completed: !habitToUpdate.completed });
  };

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newHabit = {
      title: inputValue,
      category: "New Task",
      theme:
        "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:shadow-blue-500/10",
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setInputValue("");
    await addDoc(collection(db, "habits"), newHabit);
  };

  const deleteHabit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteDoc(doc(db, "habits", id));
  };

  const completedCount = habits.filter((habit) => habit.completed).length;
  const progressPercentage =
    habits.length === 0
      ? 0
      : Math.round((completedCount / habits.length) * 100);

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-emerald-400 font-medium tracking-widest animate-pulse">
          CONNECTING TO GOOGLE CLOUD...
        </div>
      </main>
    );
  }

  return (
    // ⚠️ จุดที่ปรับแก้: ลบ max-w-5xl mx-auto ทิ้ง แล้วใช้ w-full พร้อมตั้งค่า Padding (ระยะห่างจากขอบจอ) ให้พอดี
    <main className="min-h-screen w-full px-6 md:px-12 lg:px-16 py-6 md:py-8">
      <Header today={today} progressPercentage={progressPercentage} />
      <HabitForm
        inputValue={inputValue}
        setInputValue={setInputValue}
        onAddHabit={handleAddHabit}
      />

      {/* ⚠️ จุดที่ปรับแก้: เพิ่ม xl:grid-cols-4 2xl:grid-cols-5 เพื่อให้การ์ดเรียงตัวสวยงามเมื่อจอกว้างเต็ม 100% */}
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
