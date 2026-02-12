"use client";

import { motion } from "framer-motion";
import {
    FaMapMarkerAlt,
    FaPlus,
    FaMoneyBillWave,
    FaCheckCircle,
    FaArrowLeft,
    FaShieldAlt,
    FaBox,
} from "react-icons/fa";

export default function CheckoutPage() {
    
    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#f8f6f6] px-4 md:px-10 py-10"
        >
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">

                {/* Main Section */}
                <div className="flex-1 space-y-10">

                    <div>
                        <h1 className="text-4xl font-black">الدفع</h1>
                        <p className="text-gray-500 mt-2 font-semibold">
                            يرجى مراجعة تفاصيل طلبك قبل الإتمام
                        </p>
                    </div>

                    {/* Address */}
                    <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">

                        <h2 className="text-xl font-bold">عنوان التوصيل</h2>

                        <div className="flex flex-col md:flex-row gap-6">

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 text-sky-600">
                                    <FaMapMarkerAlt />
                                    <p className="font-bold text-lg text-black">
                                        محمد أحمد
                                    </p>
                                </div>

                                <p className="text-gray-600 leading-relaxed pr-6">
                                    شارع الملك فهد، حي الصحافة <br />
                                    الرياض، 12345 <br />
                                    المملكة العربية السعودية
                                </p>

                                <p className="text-gray-500 text-sm pr-6">
                                    +966 50 123 4567
                                </p>

                                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                    <button className="px-5 py-2 rounded-md bg-gray-100 font-bold hover:bg-gray-200 transition cursor-pointer">
                                        تغيير العنوان
                                    </button>

                                    <button className="px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-gray-100 transition cursor-pointer">
                                        <FaPlus /> إضافة عنوان
                                    </button>
                                </div>
                            </div>

                            <div className="md:w-72 w-full h-44 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                <iframe
                                    title="map"
                                    className="w-full h-full"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src="https://www.google.com/maps?q=Riyadh%20Saudi%20Arabia&output=embed"
                                />
                            </div>

                        </div>
                    </section>

                    {/* Payment */}
                    <section className="bg-white rounded-xl border-2 border-black p-6 relative">

                        <FaCheckCircle className="absolute top-4 left-4 text-black text-xl" />

                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-full bg-gray-100 flex items-center justify-center">
                                <FaMoneyBillWave className="text-xl" />
                            </div>

                            <div>
                                <p className="font-bold text-lg">
                                    الدفع عند الاستلام
                                </p>
                                <p className="text-gray-500 text-sm">
                                    ادفع نقداً عند وصول الطلب
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 italic mt-4 text-left">
                            هذا الخيار الوحيد المتاح حالياً لمنطقتك
                        </p>
                    </section>

                </div>

                {/* Summary */}
                <div className="w-full lg:w-96">

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6 space-y-6">
                        <h3 className="text-xl font-bold pb-4 border-b border-gray-200 ">
                            ملخص الطلب
                        </h3>

                        <div className="space-y-3 text-gray-600">
                            <Row label="المجموع الفرعي (3 قطع)" value="450.00 ر.س" />
                            <Row label="رسوم التوصيل" value="مجاني" green />
                            <Row label="الضريبة (15%)" value="67.50 ر.س" />
                        </div>

                        <div className="pt-6 border-t border-gray-200  flex justify-between items-end">
                            <span className="font-bold text-lg">الإجمالي</span>
                            <div>
                                <span className="text-primary text-2xl font-black">
                                    517.50
                                </span>
                                <span className="text-primary text-sm font-bold mr-1">
                                    ر.س
                                </span>
                            </div>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            className="w-full py-3 cursor-pointer rounded-md bg-linear-to-br from-black to-black/70 text-white hover:-translate-y-1 duration-300 ease-in-out font-bold text-lg flex items-center justify-center gap-3 transition"
                        >
                            <FaBox />
                            إتمام الطلب
                        </motion.button>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Row({ label, value, green }) {
    return (
        <div className="flex justify-between">
            <span>{label}</span>
            <span className={green ? "text-green-600 font-medium" : ""}>
                {value}
            </span>
        </div>
    );
}

function Badge({ children }) {
    return (
        <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center font-bold text-[9px]">
            {children}
        </div>
    );
}
