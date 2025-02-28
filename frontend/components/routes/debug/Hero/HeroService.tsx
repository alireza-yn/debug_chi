"use client"
import { motion } from "framer-motion";
import React from "react";

type Props = {};

const HeroServiceName = [
  "پشتیبانی کامل",
  "زمان بندی دلخواه",
  "متخصص حرفه ای",
  "سریع و فوری",
];

const HeroService = (props: Props) => {
  return (
    <div className="w-2/4 absolute -bottom-32 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black rounded-sm grid grid-cols-4 gap-2 h-32 box-border p-2 ">
      {HeroServiceName.map((item,index)=>{
        return (
            <motion.div
            key={index}
            className="h-full bg-[#181818] flex items-center justify-center text-[#666666]"
            >
                <h3>
                {item}
                </h3>
            </motion.div>
        )
      })}
    </div>
  );
};

export default HeroService;
