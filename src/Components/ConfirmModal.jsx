"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaTimes, FaCheck } from "react-icons/fa";
import Loader from "./Loader";

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
  icon
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/20 backdrop-blur-sm px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          dir="rtl"
          className="bg-white w-full max-w-120 rounded-xl shadow-2xl p-8 flex flex-col items-center relative overflow-hidden"
        >

          {/* Icon */}
          <div className="mb-6 relative">
            {icon}
          </div>

          {/* Title */}
          <h2 className="text-[28px] md:text-[32px] font-bold text-black text-center pb-2">
            {title}
          </h2>

          {/* Message */}
          <p className="text-gray-500 text-base md:text-lg text-center pb-8 px-2 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex w-full gap-4">

            <button
              disabled={loading}
              onClick={onCancel}
              className="flex-1 h-12 rounded-lg border border-gray-200 bg-transparent text-gray-400 cursor-pointer font-bold hover:bg-gray-50 shadow-sm transition hover:-translate-y-1 duration-300 ease-in-out  flex items-center justify-center gap-2"
            >
              <FaTimes />
              إلغاء
            </button>

            <button
              disabled={loading}
              onClick={onConfirm}
              className="flex-1 h-12 rounded-lg bg-linear-to-br from-black to-black/70 text-white cursor-pointer font-bold shadow-sm transition hover:-translate-y-1 duration-300 ease-in-out flex items-center justify-center gap-2"
            >
              {
                loading ?
                  <span className="flex items-center justify-center w-full h-full"><Loader size={20} color="#fff" /></span>
                  :
                  <>
                    <FaCheck />
                    تأكيد
                  </>
              }
            </button>

          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
