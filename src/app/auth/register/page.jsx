"use client";

import { motion } from "framer-motion";
import { FaStar, FaEye, FaUser, FaEnvelope, FaLock, FaShoppingBag, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { send_otp } from "@/lib/api";
import { useRouter } from "next/navigation";
import Loader from "@/Components/Loader";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter()
  const { data, setData } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const validate = () => {
    const err = {};

    if (!data.name.trim()) err.name = "الاسم مطلوب";

    if (!data.email.trim())
      err.email = "البريد الإلكتروني مطلوب";
    else if (!/^\S+@\S+\.\S+$/.test(data.email))
      err.email = "البريد الإلكتروني غير صحيح";

    if (!data.password)
      err.password = "كلمة المرور مطلوبة";
    else if (data.password.length < 6)
      err.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";

    if (data.confirm !== data.password)
      err.confirm = "كلمتا المرور غير متطابقتين";

    if (!data.checkbox)
      err.terms = "يجب الموافقة على الشروط";

    // 🔥 show all errors in toast
    if (Object.keys(err).length > 0) {
      Object.values(err).forEach(msg => toast.error(msg));
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const sendOtp = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const payload = {
        email: data.email
      }
      const res = await send_otp(payload);

      if (res?.success) {
        toast.success(res.message);
        router.push("/auth/otp");
      } else {
        toast.error(res?.message || "حدث خطأ ما");
      }
    } catch (error) {
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
      className="min-h-screen flex items-center justify-center bg-[#f6f7f8] px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-xl max-w-full bg-white flex flex-col items-center justify-center rounded-xl border border-gray-200 p-8 md:p-12"
      >
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center justify-center">
          <div className="p-5 shadow-sm text-4xl w-fit rounded-md mb-5">

            <FaShoppingBag />
          </div>

          <h1 className="text-[32px] font-bold">إنشاء حساب جديد</h1>
          <p className="text-slate-500 mt-1">
            أدخل بياناتك لتبدأ التسوق معنا
          </p>
        </div>

        <form className="space-y-5 w-full">

          {/* Name */}
          <Input
            label="الاسم الكامل"
            placeholder="أحمد محمد"
            icon={<FaUser />}
            onChange={(e) => handleChange("name", e.target.value)}
            value={data.name}
          />

          {/* Email */}
          <Input
            label="البريد الإلكتروني"
            placeholder="name@example.com"
            ltr
            icon={<FaEnvelope />}
            onChange={(e) => handleChange("email", e.target.value)}
            value={data.email}
          />

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">كلمة المرور</label>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                dir="ltr"
                className="w-full h-12 rounded-lg border border-gray-200 px-4 pl-10 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 outline-none transition"
                onChange={(e) => handleChange("password", e.target.value)}
                value={data.password}
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}

              </button>
            </div>
          </div>

          {/* Confirm */}
          <div className="space-y-2">
            <label className="text-sm font-medium">كلمة المرور</label>

            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="••••••••"
                dir="ltr"
                className="w-full h-12 rounded-lg border border-gray-200 px-4 pl-10 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 outline-none transition"
                onChange={(e) => handleChange("confirm", e.target.value)}
                value={data.confirm}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 text-xs text-slate-500">
            <input
              type="checkbox"
              checked={data.checkbox}
              onChange={() => handleChange("checkbox", !data.checkbox)}
            className="mt-1 accent-black"
            />
            <p>
              أوافق على{" "}
              <span className="text-sky-600 hover:underline font-semibold cursor-pointer">
                شروط الخدمة
              </span>{" "}
              و{" "}
              <span className="text-sky-600 hover:underline font-semibold cursor-pointer">
                سياسة الخصوصية
              </span>
            </p>
          </div>

          {/* Submit */}
          <motion.button
            type="button"
            onClick={sendOtp}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 bg-linear-to-br from-black to-black/70 text-white rounded-lg hover:-translate-y-1 duration-300 ease-in-out font-bold shadow-sm cursor-pointer transition"
          >
            {loading ?
              <span className="flex items-center justify-center w-full h-full">
                <Loader size={20} color="#fff" />
              </span>
              : 'إنشاء حساب'}
          </motion.button>
        </form>

        {/* Login */}
        <Link
          disabled={loading}
          href={'/auth/login'} className="mt-10 text-center text-slate-500 text-sm">
          لديك حساب بالفعل؟
          <span className="text-sky-600 font-semibold mr-1 hover:underline cursor-pointer">
            تسجيل الدخول
          </span>
        </Link>
      </motion.div>
    </main>
  );
}

function Input({ label, placeholder, type = "text", ltr, icon, onChange, value }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <div className="relative">
        <input
          value={value}
          onChange={onChange}
          type={type}
          dir={ltr ? "ltr" : "rtl"}
          placeholder={placeholder}
          className="w-full h-12 rounded-lg border border-gray-200 px-4 pl-10 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 outline-none transition"
        />

        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
