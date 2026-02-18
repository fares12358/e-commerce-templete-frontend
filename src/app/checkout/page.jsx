"use client";

import Loader from "@/Components/Loader";
import { useAuth } from "@/context/AuthContext";
import { createOrders, getLocation } from "@/lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    FaMapMarkerAlt,
    FaPlus,
    FaMoneyBillWave,
    FaCheckCircle,
    FaBox,
} from "react-icons/fa";
import { toast } from "react-toastify";

const formatSendTime = (minutes) => {
    if (!minutes && minutes !== 0) return "";

    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);

    let result = "";

    if (days > 0) result += `${days} يوم `;
    if (hours > 0) result += `${hours} ساعة`;

    return result.trim();
};


export default function CheckoutPage() {
    const { addresses, setAddresses, user, cart, setupData, simple } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [orderLoading, setOrderLoading] = useState(false)

    const defaultAddress = addresses?.find(addr => addr.default);

    const toNumber = (val) => {
        const n = parseFloat(val);
        return isNaN(n) ? 0 : n;
    };

    // 🧾 حسابات آمنة 100%

    const itemsCount =
        cart?.reduce((acc, item) => acc + toNumber(item.quantity), 0) || 0;

    const subtotal =
        cart?.reduce(
            (acc, item) =>
                acc + toNumber(item.price) * toNumber(item.quantity),
            0
        ) || 0;

    const vat = toNumber(setupData?.config?.vat);

    const tax = +(subtotal * (vat / 100)).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const res = await getLocation();
            if (res.success) {
                setAddresses(res.data ?? []);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrders = async () => {
        try {
            setOrderLoading(true)
            const res = await createOrders({ locationId: defaultAddress?._id });
            if (res.success) {
                toast.success(res.message)
                router.replace(`/orderStatus?oid=${res.data._id}&num=${res.data.orderNumber}`)
            }
        } catch (err) {
            toast.error(err.message)
        } finally {
            setOrderLoading(false)
        }
    }

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
        if (!cart || cart.length === 0) {
            router.push('/cart');
        }
        if (addresses.length <= 0) {
            fetchLocations();
        }
    }, [user, cart])


    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-screen"><Loader size={30} color="#000" /></div>
        )
    }

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

                        <h2 className="text-xl font-bold"> عنوان التوصيل الافتراضي</h2>

                        <div className="flex flex-col md:flex-row gap-6">

                            <div className="flex-1 space-y-2">
                                {defaultAddress ? (
                                    <>
                                        <div className="flex items-center gap-2 text-sky-600">
                                            <FaMapMarkerAlt />
                                            <p className="font-bold text-lg text-black">
                                                {defaultAddress.strName || "عنوان التوصيل"}
                                            </p>
                                        </div>

                                        <p className="text-gray-600 leading-relaxed pr-6">
                                            {defaultAddress.country}
                                            {defaultAddress.locationDescription && (
                                                <>
                                                    {defaultAddress.locationDescription} <br />
                                                </>
                                            )}

                                            {defaultAddress.government && defaultAddress.city && (
                                                <>
                                                    {defaultAddress.government} - {defaultAddress.city} <br />
                                                </>
                                            )}

                                        </p>

                                        {defaultAddress.phone && (
                                            <p className="text-gray-500 text-sm pr-6">
                                                {defaultAddress.phone}
                                            </p>
                                        )}

                                        {defaultAddress.locationLink && (
                                            <a
                                                href={defaultAddress.locationLink}
                                                target="_blank"
                                                className="text-black font-bold hover:underline pr-6 block pt-2"
                                            >
                                                عرض الموقع على الخريطة
                                            </a>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-gray-400 p-6">
                                        لا يوجد عنوان افتراضي — الرجاء إضافة عنوان
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                    <Link href={'/myAddress'} className="px-5 py-2 rounded-md bg-gray-100 font-bold hover:bg-gray-200 transition cursor-pointer">
                                        تغيير العنوان
                                    </Link>

                                    <Link href={'/addAddress'} className="px-4 py-2 rounded-lg flex items-center gap-2 font-bold hover:bg-gray-100 transition cursor-pointer">
                                        <FaPlus /> إضافة عنوان
                                    </Link>
                                </div>
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
                            <Row
                                label={`المجموع الفرعي (${itemsCount} قطعة)`}
                                value={`${subtotal.toLocaleString()} ${simple}`}
                            />

                            {vat > 0 && (
                                <Row
                                    label={`الضريبة (${vat}%)`}
                                    value={`${tax.toLocaleString()} ${simple}`}
                                />
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-200  flex justify-between items-end">
                            <span className="font-bold text-lg">الإجمالي</span>
                            <div>
                                <span className="text-blue-400 text-2xl font-black">
                                    {total.toLocaleString()}
                                </span>
                                <span className="text-blue-400 text-sm font-bold mr-1">
                                    {simple}
                                </span>
                            </div>
                        </div>
                        {setupData?.config?.shipment && (
                            <Row
                                label="رسوم التوصيل"
                                value={`${setupData?.config?.shipment.toLocaleString()} ${simple}`}
                            />
                        )}
                        {setupData?.config?.sendTime && (
                            <Row
                                label="متوسط وقت التوصيل"
                                value={formatSendTime(setupData?.config?.sendTime)}
                            />
                        )}

                        <motion.button
                            onClick={handleCreateOrders}
                            disabled={!itemsCount || !defaultAddress || orderLoading}
                            className={`w-full py-2 rounded-md font-bold text-lg flex items-center justify-center gap-3 transition
                                ${itemsCount && defaultAddress
                                    ? "bg-linear-to-br from-black to-black/70 text-white hover:-translate-y-1 cursor-pointer"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                        >
                            {
                                orderLoading ?
                                    <span className="w-full h-full flex items-center justify-center"><Loader size={20} color="#fff" /></span>
                                    :
                                    <>
                                        <FaBox />
                                        {
                                            !itemsCount
                                                ? "السلة فارغة"
                                                : !defaultAddress
                                                    ? "أضف عنوان أولاً"
                                                    : "إتمام الطلب"
                                        }
                                    </>
                            }
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
