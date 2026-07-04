import React from 'react';

interface HabitFormProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onAddHabit: (e: React.FormEvent) => void;
}

export default function HabitForm({ inputValue, setInputValue, onAddHabit }: HabitFormProps) {
  return (
    // จุดที่ปรับแก้: เปลี่ยนเป็น w-full ให้ช่องพิมพ์ยาวเต็มพื้นที่
    <form onSubmit={onAddHabit} className="relative w-full mb-12 group">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="เพิ่มเป้าหมายใหม่ของคุณวันนี้..."
        className="w-full bg-gray-800/40 border border-gray-700 text-white rounded-2xl px-6 py-4 outline-none focus:border-emerald-500 focus:bg-gray-800/80 transition-all duration-300 placeholder-gray-500 shadow-inner"
      />
      <button
        type="submit"
        disabled={!inputValue.trim()}
        className="absolute right-2 top-2 bottom-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-700 disabled:text-gray-500 text-white px-8 rounded-xl transition-colors flex items-center justify-center font-bold"
      >
        เพิ่ม
      </button>
    </form>
  );
}