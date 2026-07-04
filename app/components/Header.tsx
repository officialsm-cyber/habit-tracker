"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface HeaderProps {
  today: string;
  progressPercentage: number;
}

export default function Header({ today, progressPercentage }: HeaderProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    const animation = animate(count, progressPercentage, {
      duration: 1,
      ease: "easeOut",
    });
    return animation.stop;
  }, [progressPercentage, count]);

  return (
    <header className="mb-10 mt-8">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
        สวัสดี เมือง,{" "}
        <span className="text-emerald-400">วันนี้พร้อมลุยไหม?</span>
      </h1>

      <p
        suppressHydrationWarning
        className="text-gray-400 text-lg tracking-wide mb-8"
      >
        {today}
      </p>

      {/* จุดที่ปรับแก้: เปลี่ยนเป็น w-full เพื่อให้หลอดพลังยาวเต็มจอ */}
      <div className="w-full">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Daily Progress
          </span>
          <div className="text-2xl font-bold text-emerald-400 flex items-center">
            <motion.span>{rounded}</motion.span>%
          </div>
        </div>

        <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className="bg-emerald-400 h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          />
        </div>
      </div>
    </header>
  );
}
