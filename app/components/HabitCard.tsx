"use client";

import React from "react";
import { motion } from "framer-motion";

// ⚠️ จุดที่อัปเดต: เปลี่ยนประเภทของ id จาก number เป็น string ให้ตรงกับระบบคลาวด์
interface HabitProps {
  habit: {
    id: string;
    title: string;
    category: string;
    theme: string;
    completed: boolean;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export default function HabitCard({ habit, onToggle, onDelete }: HabitProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={() => onToggle(habit.id)}
      className={`group p-6 rounded-2xl border backdrop-blur-sm transition-colors duration-500 cursor-pointer relative min-h-35 flex flex-col justify-between
        ${
          habit.completed
            ? "bg-gray-800/40 border-gray-700/50 opacity-60 shadow-none"
            : `${habit.theme} hover:-translate-y-1 hover:shadow-xl`
        }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span
          className={`text-xs font-bold tracking-widest uppercase transition-colors duration-300 ${habit.completed ? "text-gray-500" : "opacity-80"}`}
        >
          {habit.category}
        </span>

        <div
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0
          ${habit.completed ? "bg-emerald-500 border-emerald-500" : "border-current opacity-40 hover:opacity-100"}`}
        >
          {habit.completed && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>

      <h3
        className={`text-xl font-semibold leading-relaxed transition-all duration-300 pr-12
        ${habit.completed ? "line-through text-gray-500" : ""}`}
      >
        {habit.title}
      </h3>

      <button
        onClick={(e) => onDelete(habit.id, e)}
        className="absolute bottom-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 p-2 rounded-lg hover:bg-red-500/10"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </motion.div>
  );
}
