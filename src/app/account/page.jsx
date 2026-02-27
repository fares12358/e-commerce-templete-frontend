"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
    FaBox,
    FaMapMarkerAlt,
    FaShoppingCart,
    FaPlus,
    FaChevronLeft,
    FaLock,
} from "react-icons/fa";

export default function AccountPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user])

    if (!user) return
    return (
        <main
            className="flex-1 w-full min-h-screen max-w-240 mx-auto px-4 md:px-10 py-12 text-black"
            dir="rtl"
        >
            {/* Profile */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mb-12 text-center"
            >
                <div className="relative">
                    <div
                        className="h-32 w-32 rounded-full border-4 border-white shadow-xl bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "url(https://lh3.googleusercontent.com/aida-public/AB6AXuBmQeytHf1nj-5R0XxiZ-FpEBw2-9p-w09pgPBs-_3vI7K3DqVodETxBew_IoPIFhqgA_SV9eCIPSRhYD6JbIMK7VU6hhZiwwV0OXAlAquFydhsqGmMrU50Pj4qgnPdFsEA6OpKm0QIVZLnExl_EVoxdPVFoFN-MNp8xPIPJ7s5YZ7agwcQmSdO9QozAR-CrXTxZoFen1JuHfWYoUZj2WsQrSJbkd1THrl7DeDVIms4Win5ZkmM_nvyNqMHAKcHOu7WI3aoBLJDLoc)"
                        }}
                    />
                </div>

                <h1 className="mt-6 text-3xl font-bold">{user.name}</h1>
                <p className="text-zinc-600">{user.email}</p>

            </motion.section>

            {/* Header */}
            <div className="mb-6 flex justify-between items-center px-2">
                <h2 className="text-xl font-bold">إعدادات الحساب</h2>
            </div>

            {/* Cards */}
            <div className="space-y-3">

                <AccountItem
                    icon={<FaBox />}
                    title="طلباتي"
                    desc="تتبع الطلبات أو الشراء مرة أخرى"
                    link='/myOrders'
                />

                <AccountItem
                    icon={<FaMapMarkerAlt />}
                    title="عناويني"
                    desc="تعديل أو تعيين عنوان الشحن"
                    link='/myAddress'
                />

                <AccountItem
                    icon={<FaShoppingCart />}
                    title="عربتي"
                    desc=" عناصرك في انتظارك"
                    link='/cart'
                />

                {/* Buttons */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4">

                    <Link
                        href={'/addAddress'}
                        className="flex-1 flex items-center justify-center gap-2 bg-linear-to-br from-blue-600 to-blue-400  hover:-translate-y-1 text-white py-4 rounded-xl font-bold shadow-sm cursor-pointer transition ease-in-out duration-300"
                    >
                        <FaPlus /> إضافة عنوان جديد
                    </Link>

                    <Link
                        href={'/change-password'}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white font-bold shadow-sm hover:bg-linear-to-br hover:-translate-y-1 from-black to-black/70 hover:text-white cursor-pointer transition ease-in-out duration-300"
                    >
                        <FaLock />
                        تغير كلمة المرور
                    </Link>

                </div>
            </div>
        </main>
    );
}

function AccountItem({ icon, title, desc, link }) {
    return (
        <Link
            href={link}
            className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-xl text-zinc-400 transition group cursor-pointer"
        >
            <div className="size-12 flex items-center justify-center rounded-lg bg-linear-to-br from-black to-black/70 text-white transition">
                {icon}
            </div>

            <div className="flex-1">
                <p className="font-semibold text-zinc-800">{title}</p>
                <p className="text-sm text-zinc-600 mt-1">{desc}</p>
            </div>

            <FaChevronLeft className="text-zinc-400 transition group-hover:text-black duration-300 ease-in-out" />
        </Link>
    );
}
