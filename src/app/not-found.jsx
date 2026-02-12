"use client";

import { motion } from "framer-motion";
import { FaStar, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main
      dir="rtl"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white text-black px-6"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] rounded-full blur-3xl bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_0%,transparent_70%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-4xl text-center flex flex-col items-center"
      >
        <FaStar className="text-5xl md:text-6xl mb-4" />

        <h1 className="font-extrabold text-[130px] md:text-[220px] leading-none tracking-tighter select-none">
          404
        </h1>

        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-2">
          الصفحة غير موجودة
        </h2>

        <p className="mt-6 text-gray-500 text-lg md:text-xl max-w-lg leading-relaxed">
          عذراً، الرابط الذي تحاول الوصول إليه غير متوفر حالياً. قد يكون تم نقله أو
          حذفه نهائياً.
        </p>

        <Link
          href="/"
          className="mt-12 px-12 py-5 rounded-full font-bold text-lg text-white shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 min-w-[280px]
                     bg-gradient-to-b from-black to-neutral-600 hover:to-neutral-700"
        >
          العودة للرئيسية
          <FaArrowLeft />
        </Link>

        {/* Quick links */}
        <div className="mt-16 w-full max-w-md">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 font-bold">
            روابط سريعة
          </p>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <QuickLink href="/">الرئيسية</QuickLink>
            <QuickLink href="#">المتجر</QuickLink>
            <QuickLink href="#">الدعم الفني</QuickLink>
          </div>
        </div>

        <div className="mt-20 w-32 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      </motion.div>

      <footer className="absolute bottom-6 text-gray-400 text-xs font-medium tracking-wide">
        © 2024 متجر. جميع الحقوق محفوظة.
      </footer>
    </main>
  );
}

function QuickLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-sm font-bold border-b-2 border-transparent hover:border-black transition-all pb-1"
    >
      {children}
    </Link>
  );
}
