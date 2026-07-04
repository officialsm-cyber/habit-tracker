"use client";

import { motion } from "framer-motion";

interface HabitFormProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onAddHabit: (e: React.FormEvent) => void;
}

export default function HabitForm({
  inputValue,
  setInputValue,
  onAddHabit,
}: HabitFormProps) {
  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      onSubmit={onAddHabit}
      className="mb-10 relative group"
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="เพิ่มเป้าหมายใหม่ของคุณวันนี้..."
        className="w-full bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-800 rounded-2xl px-6 py-4 outline-none focus:border-blue-500 transition-colors shadow-sm"
      />
      <button
        type="submit"
        className="absolute right-2 top-2 bottom-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-lg"
      >
        เพิ่ม
      </button>
    </motion.form>
  );
}
