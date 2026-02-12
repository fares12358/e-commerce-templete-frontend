"use client";
import { useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "@/Components/Loader";
import { resetPassword } from "@/lib/api";
import { motion } from "framer-motion";
import { FaStar, FaEye, FaArrowLeft, FaLock, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!password) {
      toast.error("أدخل كلمة المرور الجديدة");
      return false;
    }
    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return false;
    }
    if (!token) {
      toast.error("رابط إعادة التعيين غير صالح");
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await resetPassword(token, { password });
      if (res?.success) {
        toast.success(res.message || "تم تحديث كلمة المرور بنجاح");
        router.push("/auth/login");
      } else {
        toast.error(res?.message || "الرابط غير صالح أو منتهي");
      }

    } catch {
      toast.error("فشل الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[#f8f6f6] px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-xl max-w-full bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center shadow-sm p-8 md:p-12"
      >
        {/* Header Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-md p-5 shadow-sm flex items-center justify-center">
            <FaLock className="text-3xl" />
          </div>
        </div>

        <h1 className="text-[32px] font-bold text-center mb-3">
          إعادة تعيين كلمة المرور
        </h1>

        <p className="text-gray-500 text-center mb-8">
          أدخل كلمة مرور جديدة لحسابك
        </p>

        <form className="space-y-6 w-full">

          {/* New password */}
          <PasswordInput
            label="كلمة المرور الجديدة"
            show={show1}
            toggle={() => setShow1(!show1)}
            value={password}
            onChange={setPassword}
          />

          <PasswordInput
            label="تأكيد كلمة المرور الجديدة"
            show={show2}
            toggle={() => setShow2(!show2)}
            value={confirmPassword}
            onChange={setConfirmPassword}
          />


          <motion.button
            type="button"
            onClick={handleResetPassword}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full h-14 bg-linear-to-br from-black to-black/70 text-white rounded-lg flex justify-center items-center hover:-translate-y-1 ease-in-out duration-300 cursor-pointer "
          >
            {loading ? <span className="flex items-center justify-center w-full h-full"><Loader size={20} color="#fff" /></span> : "تحديث كلمة المرور"}
          </motion.button>

        </form>

        {/* Back */}
        <Link href={'/auth/login'} className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-black transition">
          العودة لتسجيل الدخول <FaArrowLeft />
        </Link>
      </motion.div>
    </main>
  );
}

function PasswordInput({ label, show, toggle, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-base font-medium">{label}</label>

      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={show ? "text" : "password"}
          placeholder="••••••••"
          className="w-full h-14 rounded-lg border border-gray-200 px-4 pr-4 pl-12 focus:border-2 focus:border-sky-600 outline-none transition"
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
}
