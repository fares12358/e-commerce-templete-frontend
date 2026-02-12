"use client";

import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaShoppingBag, FaStore } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "@/Components/Loader";

export default function LoginPage() {
    const { setUser } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("fares.dev.m@gmail.com");
    const [password, setPassword] = useState("123456789");
    const [loading, setLoading] = useState(false);

    const [showPass, setShowPass] = useState(false);

    const validate = () => {
        if (!email.trim()) {
            toast.error("أدخل البريد الإلكتروني");
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast.error("البريد الإلكتروني غير صحيح");
            return false;
        }
        if (!password) {
            toast.error("أدخل كلمة المرور");
            return false;
        }
        return true;
    };


    const handleLogin = async () => {
        if (loading) return;
        if (!validate()) return;

        try {
            setLoading(true);

            const res = await login({ email, password });

            if (res?.success) {
                toast.success("تم تسجيل الدخول بنجاح");
                setUser(res.data);
                router.push("/");
            } else {
                toast.error(res?.message || "بيانات غير صحيحة");
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
        <div
            className="min-h-screen flex items-center justify-center"
            dir="rtl"
        >
            <main className="w-xl max-w-full flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-white border border-gray-200 rounded-xl p-8 md:p-10 flex flex-col items-center"
                >
                    <div className="p-5 shadow-sm text-4xl w-fit rounded-md mb-5">

                        <FaShoppingBag />
                    </div>

                    <h1 className="text-3xl font-bold text-center">مرحباً بعودتك</h1>
                    <p className="text-gray-500 text-sm text-center mt-2">
                        أدخل بياناتك للوصول إلى حسابك
                    </p>

                    <form className="space-y-5 mt-8 w-full">
                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-sm">
                                البريد الإلكتروني
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="name@example.com"
                                dir="ltr"
                                className="h-12 rounded-lg border border-gray-200 px-4 text-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600 outline-none transition"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-sm">
                                كلمة المرور
                            </label>

                            <div className="relative">
                                <input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPass ? "text" : "password"}
                                    placeholder="••••••••"
                                    dir="ltr"
                                    className="w-full h-12 rounded-lg border border-gray-200 px-4 pl-10 text-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600 outline-none transition"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                                >
                                    {showPass ? <FaEyeSlash /> : <FaEye />
                                    }
                                </button>
                            </div>

                            <Link href={'/auth/forget-password'} className="text-sky-600 font-bold text-xs hover:underline mt-1">
                                نسيت كلمة المرور؟
                            </Link>
                        </div>

                        {/* Submit */}
                        <motion.button
                            type="button"
                            onClick={handleLogin}
                            disabled={loading}
                            whileTap={{ scale: 0.97 }}
                            className="w-full h-12 bg-black text-white rounded-lg flex justify-center cursor-pointer items-center"
                        >
                            {loading ? <Loader size={20} color="#fff" /> : "تسجيل الدخول"}
                        </motion.button>

                        {/* Register */}
                        <Link href={'/auth/register'} className="text-center text-sm text-gray-500">
                            ليس لديك حساب؟
                            <span className="font-bold text-sky-600 hover:underline mr-1 cursor-pointer">
                                تسجيل حساب جديد
                            </span>
                        </Link>
                    </form>
                </motion.div>
            </main>
        </div>
    );
}
