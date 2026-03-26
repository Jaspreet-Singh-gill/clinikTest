"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
          HealthQueue
        </h1>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-md border border-gray-200 dark:border-gray-700 
                       text-gray-700 dark:text-gray-300 
                       hover:bg-gray-100 dark:hover:bg-gray-900 
                       transition"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Login Button */}
          <button
            className="px-4 py-2 rounded-md 
                       bg-black text-white 
                       dark:bg-white dark:text-black
                       hover:opacity-80 transition"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
