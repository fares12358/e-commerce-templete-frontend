"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaLock, FaStar } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import Loader from "@/Components/Loader";
import { updatePassword } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false)

  const handleUpdatePassword = async () => {

    if (!current || !password || !confirm) {
      return toast.error("يرجى ملء جميع الحقول");
    }

    if (password.length < 8) {
      return toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    }

    if (password !== confirm) {
      return toast.error("كلمتا المرور غير متطابقتين");
    }

    try {
      setLoading(true);

      const res = await updatePassword({ current, password })

      if (res.success) {
        toast.success(res.message);
        setCurrent("");
        setPassword("");
        setConfirm("");
      }

    } catch (error) {
      toast.error(
        error.message || "فشل الاتصال بالسيرفر"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user]);

  return (
    <main
      dir="rtl"
      className="bg-[#f7f7f7] min-h-screen flex items-center justify-center p-6 sm:p-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-130 bg-white  p-8 sm:p-12 rounded-xl shadow-sm border border-neutral-100 "
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <FaLock className="text-4xl mb-4 text-[#1a1a1a] " />
          <h1 className="tracking-tight text-3xl font-bold text-center">
            تغيير كلمة المرور
          </h1>
          <p className="text-neutral-500 text-sm mt-2 text-center">
            يرجى إدخال كلمة المرور الحالية والجديدة لتحديث بياناتك
          </p>
        </div>

        <form className="flex flex-col gap-6">

          <PasswordField
            label="كلمة المرور الحالية"
            placeholder="أدخل كلمة المرور الحالية"
            value={current}
            onChange={setCurrent}
            show={showCurrent}
            toggle={() => setShowCurrent(!showCurrent)}
          />

          <PasswordField
            label="كلمة المرور الجديدة"
            value={password}
            onChange={setPassword}
            placeholder="أدخل كلمة المرور الجديدة"
            show={showNew}
            toggle={() => setShowNew(!showNew)}
          />

          <PasswordField
            label="تأكيد كلمة المرور الجديدة"
            placeholder="أعد إدخال كلمة المرور الجديدة"
            value={confirm}
            onChange={setConfirm}
            show={showConfirm}
            toggle={() => setShowConfirm(!showConfirm)}
          />

          <button
            type="button"
            onClick={handleUpdatePassword}
            disabled={loading}
            className="w-full h-14 rounded-lg text-white font-bold cursor-pointer text-lg bg-black hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? <span className="flex items-center justify-center w-full h-full"><Loader size={20} color="#fff" /></span> : "تغيير كلمة المرور"}
          </button>

          <div className="flex justify-center mt-2">
            <Link
              href="/auth/forget-password"
              className="text-neutral-500 hover:text-[#1a1a1a] text-sm font-medium transition-colors"
            >
              هل نسيت كلمة المرور؟
            </Link>
          </div>

        </form>
      </motion.div>
    </main>
  );
}

/* Reusable field */

function PasswordField({ label, placeholder, show, toggle, value,
  onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-medium">{label}</label>

      <div className="flex w-full items-stretch rounded-lg relative">

        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-14 rounded-lg border border-neutral-300 bg-white focus:border-none focus:ring-2 focus:ring-sky-600 outline-none px-4 text-base placeholder:text-neutral-400 text-[#1a1a1a]"
        />

        <button
          type="button"
          onClick={toggle}
          className=" absolute top-1/2 -translate-y-1/2 left-2 text-neutral-400 hover:text-[#1a1a1a] transition flex items-center justify-center cursor-pointer"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>

      </div>
    </div>
  );
}
