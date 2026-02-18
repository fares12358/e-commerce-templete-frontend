"use client";

import { motion } from "framer-motion";
import { FaShoppingBag, FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p < 100 ? p + 1 : 100));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      dir="rtl"
      className="relative h-screen w-full flex items-center justify-center bg-white overflow-hidden"
    >
      <div className="flex flex-col items-center w-full max-w-120 px-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-8 mb-12">
          <FaShoppingBag className={'text-3xl text-black'}/>
        </div>

        {/* Progress */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-end px-1">
            <p className="text-black/40 text-xs font-medium tracking-widest uppercase">
              جاري التحميل
            </p>
            <p className="text-black text-xs font-bold tabular-nums">
              {progress}%
            </p>
          </div>

          {/* Bar */}
          <div className="h-0.5 w-full bg-black/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-br from-black to-neutral-600"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />
          </div>

          <p className="text-black/60 text-[10px] text-center tracking-wide mt-2">
            يتم تحضير تجربة تسوق فريدة لك
          </p>
        </div>
      </div>

      {/* Footer accent */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <div className="w-8 h-px bg-red-500/40" />
        <p className="text-black/30 text-[9px] uppercase tracking-[0.2em]">
          Premium E-Commerce Experience
        </p>
      </div>
    </main>
  );
}
