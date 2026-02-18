"use client";

import { motion } from "framer-motion";
import {
  FaCheck,
  FaTruck,
  FaHome,
} from "react-icons/fa";

export default function OrderSuccess({
  orderId = "#INV-00001",
  onTrack,
  onHome,
}) {
  return (
    <main
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[#f6f8f6] px-4 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-140 w-full flex flex-col items-center text-center"
      >
        {/* Success circle */}
        <motion.div
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="w-24 h-24 rounded-full border-4 border-green-500/20 bg-green-500/10 flex items-center justify-center mb-6"
        >
          <FaCheck className="text-green-500 text-4xl" />
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-1">تم طلبك بنجاح!</h1>
        <p className="text-black/70 mb-8">شكراً لتسوقك معنا.</p>

        {/* Order details */}
        <div className="w-full bg-white border border-green-100 rounded-xl p-8 mb-10 shadow-sm space-y-6 text-right">
          <Row label="رقم الطلب" value={orderId} bold />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">

          <button
            onClick={onTrack}
            className="flex-1 cursor-pointer px-8 py-3 rounded-md hover:-translate-y-1 duration-300 ease-in-out text-white font-bold bg-linear-to-br from-black to-black/70  transition flex items-center justify-center gap-2"
          >
            <FaTruck />
            تتبع الطلب
          </button>

          <button
            onClick={onHome}
            className="flex-1 cursor-pointer px-8 py-3 rounded-md hover:-translate-y-1 duration-300 ease-in-out border border-gray-200 font-bold bg-linear-to-br from-gray-200 to-gray-100 text-gray-600 transition flex items-center justify-center gap-2"
          >
            <FaHome />
            العودة للرئيسية
          </button>

        </div>

      </motion.div>
    </main>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-none last:pb-0">
      <span className="text-black/60 text-sm">{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"}`}>
        {value}
      </span>
    </div>
  );
}
