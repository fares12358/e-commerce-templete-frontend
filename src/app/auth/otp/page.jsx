"use client";

import { motion } from "framer-motion";
import { FaClock, FaEdit, FaArrowLeft, FaShieldAlt, FaPen } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { send_otp, varfy_otp } from "@/lib/api";
import { toast } from "react-toastify";
import Loader from "@/Components/Loader";
import { useRouter } from "next/navigation";

export default function OtpVerificationPage() {
    const router = useRouter();
    const { data, setdata, user, setUser } = useAuth();

    const RESEND_TIME = 60;
    const [timer, setTimer] = useState(RESEND_TIME);
    const [canResend, setCanResend] = useState(false);
    const [shake, setShake] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [resending, setResending] = useState(false);


    const length = 6;
    const inputs = useRef([]);
    const [code, setCode] = useState(Array(length).fill(""));

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        // Paste full code
        if (value.length === length) {
            value.split("").forEach((v, i) => {
                if (i < length) newCode[i] = v;
            });
            setCode(newCode);
            inputs.current[length - 1]?.focus();
            setTimeout(verifyOtp, 200);
            return;
        }
        newCode[index] = value;
        setCode(newCode);
        if (value && index < length - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleBack = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const otpValue = code.join("");

    const verifyOtp = async () => {
        if (verifying) return;

        if (otpValue.length !== length) {
            setShake(true);
            setTimeout(() => setShake(false), 400);
            toast.error("أدخل رمز التحقق كامل");
            return;
        }

        try {
            setVerifying(true);

            const payload = {
                name: data.name,
                email: data.email,
                password: data.password,
                otp: otpValue,
            };

            const res = await varfy_otp(payload);

            if (res?.success) {
                toast.success(res.message || "تم التحقق بنجاح");
                setUser(res.data)
                router.push("/auth/login");
            } else {
                setShake(true);
                setTimeout(() => setShake(false), 400);
                toast.error(res?.message || "رمز غير صحيح");
            }

        } catch (error) {
            setShake(true);
            toast.error(
                error?.message ||
                error?.response?.data?.message ||
                "فشل الاتصال بالسيرفر"
            );
        } finally {
            setVerifying(false);
        }
    };


    const sendOtp = async () => {
        if (resending) return;

        try {
            setResending(true);

            const res = await send_otp({ email: data.email });

            if (res?.success) {
                toast.success(res.message);
                setTimer(RESEND_TIME);
                setCanResend(false);
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
            setResending(false);
        }
    };

    useEffect(() => {
        if (timer <= 0) {
            setCanResend(true);
            return;
        }
        const interval = setInterval(() => {
            setTimer(t => t - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);


    return (
        <main
            dir="rtl"
            className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfc] px-4"
        >
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-xl max-w-full bg-white p-10 md:p-16 flex flex-col items-center justify-center rounded-lg border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.04)] text-center"
            >
                {/* Icon */}
                <div className="flex justify-center mb-8">
                    <div className="p-5 rounded-md shadow-sm flex items-center justify-center">
                        <FaShieldAlt className="text-3xl" />
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    التحقق من الرمز
                </h1>

                <p className="text-neutral-500 text-lg mb-10">
                    أدخل رمز التحقق المرسل إلى الايميل
                    <br />
                    <span dir="ltr" className="font-medium text-black">
                        fares.dev.m@gmail.com
                    </span>
                </p>
                <motion.div
                    animate={{
                        x: shake ? [-10, 10, -8, 8, -5, 5, 0] : 0
                    }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-row-reverse justify-center gap-4 mb-10"
                >


                    {/* OTP */}

                    {code.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => (inputs.current[i] = el)}
                            value={digit}
                            maxLength={1}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleBack(i, e)}
                            className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold border-2 border-black rounded-xl"
                        />
                    ))}

                </motion.div>
                {/* Actions */}
                <div className="space-y-8">

                    <motion.button
                        onClick={verifyOtp}
                        disabled={verifying}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-3 bg-black text-white rounded-md flex justify-center"
                    >
                        {verifying ? <span className="flex items-center justify-center w-full h-full"><Loader size={20} color="#fff" /></span> : "تحقق"}
                    </motion.button>



                    <div className="space-y-4 text-sm">

                        <div className="flex justify-center items-center gap-2 text-neutral-500">
                            لم يصلك الرمز؟
                            <span className="flex items-center gap-1 text-black font-semibold">
                                <span dir="ltr">{`00:${String(timer).padStart(2, "0")}`}</span>

                                <FaClock />
                            </span>
                        </div>

                        <div className="space-y-2 flex flex-col items-center justify-center">
                            <button
                                disabled={!canResend || resending}
                                onClick={sendOtp}
                                className={`block w-full underline transition
                                ${canResend ? "text-black hover:text-sky-600" : "text-neutral-300 cursor-not-allowed"}`}
                            >
                                {resending ? <span className="flex items-center justify-center w-full h-full"><Loader size={20} color="#000" />
                                </span> : "إعادة إرسال الرمز"}
                            </button>

                            <Link href={'/auth/register'} className="flex mx-auto items-center gap-2 text-sm cursor-pointer hover:text-sky-600 font-bold">
                                تغيير الايميل <FaPen />
                            </Link>
                        </div>

                    </div>
                </div>
            </motion.div>

            {/* Back */}
            <Link href={'/auth/login'} className="mt-12 flex items-center gap-2 text-neutral-400 hover:text-black text-sm font-medium transition">
                العودة لتسجيل الدخول <FaArrowLeft />
            </Link>

            <footer className="mt-10 text-neutral-300 text-xs">
                © 2024 متجرنا - تجربة تسوق متميزة
            </footer>
        </main>
    );
}
