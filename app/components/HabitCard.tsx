"use client";

import { motion } from "framer-motion";

interface Habit {
  id: string;
  title: string;
  category: string;
  theme: string;
  completed: boolean;
}

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export default function HabitCard({
  habit,
  onToggle,
  onDelete,
}: HabitCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
      // ⚠️ จุดสำคัญที่ 1: เพิ่มระบบโช้คอัพ (Spring) ให้การขยับการ์ดนุ่มนวลขึ้น
      transition={{
        layout: { type: "spring", stiffness: 350, damping: 25 },
        opacity: { duration: 0.2 },
      }}
      // ⚠️ จุดสำคัญที่ 2: เปลี่ยนจาก transition-all เป็น transition-colors
      className={`group p-6 rounded-3xl border backdrop-blur-sm transition-colors duration-300 relative overflow-hidden cursor-pointer flex flex-col justify-between min-h-40
        ${
          habit.completed
            ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/20"
            : "bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 shadow-sm"
        } 
        ${habit.theme}`}
      onClick={() => onToggle(habit.id)}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold tracking-wider uppercase opacity-70">
          {habit.category}
        </span>
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300
          ${habit.completed ? "border-emerald-500 bg-emerald-500" : "border-gray-400 dark:border-gray-600 group-hover:border-blue-500"}`}
        >
          {habit.completed && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>

      <div>
        <h3
          className={`text-lg font-bold mb-1 transition-colors duration-300 ${habit.completed ? "text-emerald-700 dark:text-emerald-400" : "text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400"}`}
        >
          {habit.title}
        </h3>
      </div>

      <button
        onClick={(e) => onDelete(habit.id, e)}
        // ปุ่มลบยังสามารถใช้ transition-all ได้ เพราะไม่มีผลกับการขยับเลย์เอาต์ครับ
        className="absolute bottom-4 right-4 p-2 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-200 dark:hover:bg-red-500/20"
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </motion.div>
  );
}
