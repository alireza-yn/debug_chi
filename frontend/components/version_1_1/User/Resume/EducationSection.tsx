"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type EducationItem = {
  id: number;
  title: string;
  color: string;
  textColor: string;
  size: string;
};

const EducationSection = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sample education items with different colors and sizes
  const educationItems: EducationItem[] = [
    {
      id: 1,
      title: "تحقیقات کاربر",
      color: "bg-purple-900",
      textColor: "text-white",
      size: "w-48 h-48",
    },
    {
      id: 2,
      title: "راهنمای سبک",
      color: "bg-purple-300",
      textColor: "text-white",
      size: "w-52 h-52",
    },
    {
      id: 3,
      title: "طراحی بصری",
      color: "bg-white",
      textColor: "text-gray-900",
      size: "w-56 h-56",
    },
    {
      id: 4,
      title: "تست",
      color: "bg-purple-900",
      textColor: "text-white",
      size: "w-44 h-44",
    },
    {
      id: 5,
      title: "تست",
      color: "bg-purple-900",
      textColor: "text-white",
      size: "w-44 h-44",
    },
  ];

  // Calculate positions for the circles around the main circle
  const getPosition = (index: number, total: number, radius: number) => {
    // Start from the top-left position (225 degrees) and go clockwise
    const startAngle = Math.PI * 1.25;
    const angle = startAngle + (index / total) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return { x, y };
  };

  // Small glowing dots on the circular path
  const dots = [0, 1, 2, 3];

  return (
    <div className="w-full flex items-center justify-center min-h-screen bg-gray-950 box-border p-5 relative overflow-hidden rounded-3xl">
      {/* Dotted circular path */}
      <div className="absolute w-[700px] h-[700px] rounded-full border border-dashed border-purple-500/30"></div>

      {/* Small glowing dots on the path */}
      {dots.map((dot, index) => {
        const dotPosition = getPosition(index + 0.5, dots.length, 350);

        return (
          <motion.div
            key={`dot-${index}`}
            className="absolute w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50 z-20"
            style={{
              left: "50%",
              top: "50%",
              marginLeft: "-4px",
              marginTop: "-4px",
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: dotPosition.x,
              y: dotPosition.y,
              opacity: mounted ? 1 : 0,
            }}
            transition={{
              duration: 0.5,
              delay: 1.5 + index * 0.2,
            }}
          />
        );
      })}

      {/* Main central circle with gradient and dot pattern */}
      <motion.div
        className="w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-center p-8 z-10 relative shadow-xl shadow-purple-700/20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Dot pattern overlay */}
        <div className="absolute inset-0 rounded-full overflow-hidden opacity-20 ">
          <div className="w-full h-full bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[length:10px_10px]"></div>
        </div>

        <h2 className="text-2xl font-bold text-white relative z-10">
          مشکل و راه حل
        </h2>
      </motion.div>

      {/* Surrounding circles */}
      {educationItems.map((item, index) => {
        const position = getPosition(index, educationItems.length, 300);

        return (
          <motion.div
            key={item.id}
            className={`${item.size} rounded-full ${item.color} absolute flex items-center justify-center text-center p-4 shadow-lg z-10 border-8 border-gray-950`}
            style={{
              boxShadow:
                item.color === "bg-white"
                  ? "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                  : "none",
            }}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{
              opacity: mounted ? 1 : 0,
              x: position.x,
              y: position.y,
            }}
            transition={{
              duration: 0.7,
              delay: 0.8 + index * 0.2,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
          >
            {/* Dot pattern overlay for dark circles */}
            {item.color.includes("purple-900") && (
              <div className="absolute inset-0 rounded-full overflow-hidden opacity-20">
                <div className="w-full h-full bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[length:8px_8px]"></div>
              </div>
            )}

            <p
              className={`text-lg font-medium ${item.textColor} relative z-10`}
            >
              {item.title}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default EducationSection;
