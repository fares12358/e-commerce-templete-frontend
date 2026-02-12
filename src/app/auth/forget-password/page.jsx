"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaLock, FaArrowLeft, FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "@/Components/Loader";
import { forgotPassword } from "@/lib/api";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      toast.error("أدخل البريد الإلكتروني");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("البريد الإلكتروني غير صحيح");
      return false;
    }
    return true;
  };

  const handleForgotPassword = async () => {
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await forgotPassword({ email });
      if (res?.success) {
        toast.success(res.message || "تم إرسال الرابط إلى بريدك الإلكتروني");
      } else {
        toast.error(res?.message || "تعذر إرسال الرابط");
      }

    } catch(error) {
      toast.error(
        error?.message ||
        error?.response?.data?.message ||
        "فشل الاتصال بالسيرفر"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-xl max-w-full bg-white flex flex-col items-center justify-center rounded-xl border border-gray-200 p-8"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-5 rounded-md shadow-sm flex items-center justify-center">
            <FaLock className="text-3xl" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-[32px] font-bold text-center mb-3">
          نسيت كلمة المرور
        </h1>

        <p className="text-gray-500 text-center mb-8 leading-relaxed">
          أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
        </p>

        {/* Form */}
        <div className="space-y-6 w-full">

          <div className="space-y-2">
            <label className="text-sm font-medium">
              البريد الإلكتروني
            </label>

            <div className="relative">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                dir="ltr"
                placeholder="example@name.com"
                className="w-full h-14 rounded-lg border border-gray-200 px-4 pl-10 focus:border-sky-600 focus:border-2 outline-none transition"
              />

              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            onClick={handleForgotPassword}
            disabled={loading}
            className="w-full h-14 bg-linear-to-br from-black to-black/70 text-white cursor-pointer rounded-lg font-bold shadow hover:-translate-y-1 duration-300 ease-in-out transition"
          >
            {loading ? <span className="flex items-center justify-center w-full h-full"><Loader size={20} color="#fff" />  </span> : "إرسال رابط استعادة كلمة المرور"}
          </motion.button>

          {/* Back */}
          <Link href={'/auth/login'} className="text-sky-600 font-bold flex items-center justify-center gap-2 text-sm hover:underline cursor-pointer">
            العودة لتسجيل الدخول
            <FaArrowLeft className="text-xs" />
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
