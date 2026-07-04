"use client";

import { motion } from "framer-motion";

interface HeaderProps {
  today: string;
  progressPercentage: number;
}

export default function Header({ today, progressPercentage }: HeaderProps) {
  return (
    <div className="mb-8 md:mb-12 mt-16 md:mt-0">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight"
      >
        สวัสดี เมือง, วันนี้พร้อมลุยไหม?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-gray-600 dark:text-gray-400 font-medium tracking-wide uppercase"
      >
        {today}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        className="mt-8"
      >
        <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-500 mb-3 tracking-widest">
          <span>DAILY PROGRESS</span>
          <span className="text-emerald-600 dark:text-emerald-400 text-base">
            {progressPercentage}%
          </span>
        </div>
        <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
