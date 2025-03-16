"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { ThemeSwitcher } from "../ui/ThemeSwitcher";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 "
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          className="text-2xl font-bold text-violet-500 bg-clip-text text-transparent font-GiestMono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
   debug_chi
        </motion.div>

        <div className="hidden md:flex space-x-6 space-x-reverse rtl">
          {["خانه", "خدمات", "درباره ما", "تماس با ما"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors font-medium">
                {item}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center space-x-4">
         <ThemeSwitcher />

          <motion.button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-white dark:bg-gray-800 py-4 px-4 shadow-md"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-4 items-end">
            {["خانه", "خدمات", "درباره ما", "تماس با ما"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
