"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { motion } from "framer-motion";
import {
    FaMapMarkerAlt,
    FaCrosshairs,
    FaPlusCircle,
    FaArrowLeft,
    FaTimes,
    FaPlus,
} from "react-icons/fa";
import { addLocation, getLocation } from "@/lib/api";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

/* ================= RTL FIX ================= */
if (typeof window !== "undefined") {
    if (maplibregl.getRTLTextPluginStatus() === "unavailable") {
        maplibregl.setRTLTextPlugin(
            "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.js",
            null,
            true
        );
    }
}

const initialForm = {
    country: "",
    city: "",
    region: "",
    street: "",
    description: "",
    phone: "",
    locationLink: "",
    lat: null,
    lng: null,
};


export default function AddAddressPage() {
    const { user, setAddresses } = useAuth()
    const mapRef = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const [submitting, setSubmitting] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [phoneFocused, setPhoneFocused] = useState(false);
    const [showLocationNote, setShowLocationNote] = useState(true);

    const router = useRouter();

    const closeNote = () => {
        setShowLocationNote(false);
    };


    const resetPage = () => {
        // Reset form
        setForm(initialForm);

        // Reset marker & map
        const defaultLng = 39.1925;
        const defaultLat = 21.4858;

        if (marker.current && map.current) {
            marker.current.setLngLat([defaultLng, defaultLat]);
            map.current.flyTo({
                center: [defaultLng, defaultLat],
                zoom: 13,
            });
        }

        // Reset loaders
        setSubmitting(false);
        setLoadingLocation(false);
    };


    /* ================= MAP INIT ================= */
    useEffect(() => {
        if (!mapRef.current) return; // 🔥 مهم جدًا
        if (map.current) return;     // 🔥 يمنع التكرار

        map.current = new maplibregl.Map({
            container: mapRef.current,
            style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
            center: [39.1925, 21.4858],
            zoom: 13,
        });

        marker.current = new maplibregl.Marker({ draggable: true })
            .setLngLat([39.1925, 21.4858])
            .addTo(map.current);

        const updateAddress = async (lng, lat) => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );
                const data = await res.json();

                setForm((prev) => ({
                    ...prev,
                    country: data.address?.country || "",
                    city:
                        data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        "",
                    region: data.address?.state || "",
                    street: data.address?.road || "",
                    lat,
                    lng,
                    locationLink: generateLocationLink(lat, lng),
                }));
            } catch (err) {
                console.log(err);
            }
        };

        marker.current.on("dragend", () => {
            const { lng, lat } = marker.current.getLngLat();
            updateAddress(lng, lat);
        });

        map.current.on("click", (e) => {
            marker.current.setLngLat(e.lngLat);
            updateAddress(e.lngLat.lng, e.lngLat.lat);
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [user]); // 🔥 خليها تعتمد على user

    /* ================= GPS ================= */
    const detectMyLocation = () => {
        toast.info("جاري تحديد موقعك...");
        setLoadingLocation(true);

        if (!navigator.geolocation) {
            toast.error("المتصفح لا يدعم تحديد الموقع");
            setLoadingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lng = pos.coords.longitude;
                const lat = pos.coords.latitude;

                // 🔥 1- حرك الماب فورًا (بدون انتظار API)
                marker.current.setLngLat([lng, lat]);
                map.current.flyTo({ center: [lng, lat], zoom: 15 });

                // 🔥 2- حدّث الإحداثيات فورًا
                setForm((prev) => ({
                    ...prev,
                    lat,
                    lng,
                    locationLink: generateLocationLink(lat, lng),
                }));

                // 🔥 3- اعمل reverse geocode في الخلفية
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);

                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
                        { signal: controller.signal }
                    );

                    clearTimeout(timeoutId);

                    const data = await res.json();

                    setForm((prev) => ({
                        ...prev,
                        country: data.address?.country || "",
                        city:
                            data.address?.city ||
                            data.address?.town ||
                            data.address?.village ||
                            "",
                        region: data.address?.state || "",
                        street: data.address?.road || "",
                    }));
                } catch (err) {
                    console.log("Reverse geocode failed:", err);
                }

                setLoadingLocation(false);
            },
            (error) => {
                setLoadingLocation(false);

                if (error.code === 1) {
                    toast.error("تم رفض إذن تحديد الموقع");
                } else {
                    toast.error("تعذر تحديد الموقع");
                }
            },
            {
                enableHighAccuracy: false, // 🔥 أسرع
                timeout: 8000,             // 🔥 أقصى وقت انتظار
                maximumAge: 60000          // 🔥 استخدم كاش لو موجود
            }
        );
    };

    const generateLocationLink = (lat, lng) => {
        if (!lat || !lng) return "";
        return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`;
    };

    /* ================= INPUT HANDLER ================= */
    const handleChange = (key, value) => {
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const normalizePhoneNumber = (phone) => {
        if (!phone) return "";

        // شيل المسافات
        let cleaned = phone.replace(/\s+/g, "");

        // لو بدأ بـ 00 → حوّله +
        if (cleaned.startsWith("00")) {
            cleaned = "+" + cleaned.slice(2);
        }

        // لو مفيش + → أضف +
        if (!cleaned.startsWith("+")) {
            cleaned = "+" + cleaned;
        }

        // شيل أي حاجة غير رقم و +
        cleaned = "+" + cleaned.slice(1).replace(/\D/g, "");

        return cleaned;
    };


    /* ================= SUBMIT ================= */

    const handleSubmit = async () => {

        if (!form.phone) {
            toast.error("رقم الهاتف مطلوب");
            return;
        }

        if (!form.description) {
            toast.error("وصف الموقع مطلوب");
            return;
        }
        const normalizedPhone = normalizePhoneNumber(form.phone);

        if (normalizedPhone.length < 10) {
            toast.error("رقم الهاتف غير صحيح");
            return;
        }

        const payload = {
            locationDescription: form.description,
            country: form.country,
            city: form.city,
            government: form.region,
            locationLink: form.locationLink,
            strName: form.street,
            phone: normalizedPhone,
        };

        try {
            setSubmitting(true);

            await addLocation(payload);

            toast.success("تم إضافة العنوان بنجاح ✅");
            const res = await getLocation();
            if (res.success) {
                setAddresses(res.data ?? []);
            }
                resetPage();
        } catch (err) {
            toast.error(err.message || "حدث خطأ أثناء الحفظ");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (!user) {
            router.push('/')
        }
    }, [user])

    if (!user) return null

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#f6f7f8] flex justify-center px-4 py-12"
        >
            <div className="max-w-250 w-full space-y-10">

                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        إضافة عنوان جديد
                    </h1>
                    <p className="text-slate-500">
                        حدّد موقعك على الخريطة وأكمل البيانات
                    </p>
                </div>

                {/* Map */}
                <motion.div
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                >
                    <div className="flex flex-col lg:flex-row  justify-between gap-2 items-center p-4 border-b border-slate-200">
                        <button
                            onClick={detectMyLocation}
                            disabled={loadingLocation}
                            className="text-black text-sm font-bold flex items-center gap-2 cursor-pointer shadow-sm py-3 p-4 rounded-md bg-linear-to-br from-gray-200 to-gray-50"
                        >
                            <FaCrosshairs /> تحديد موقعي الحالي 
                        </button>
                        {showLocationNote && (
                            <div className="flex items-start justify-between gap-3 bg-yellow-50 border border-yellow-200
                                        text-yellow-900 text-sm px-4 py-3 rounded-md">
                                <div className="flex gap-2">
                                    <FaCrosshairs className="mt-0.5" />
                                    <span>
                                        لتحديد موقعك تلقائيًا، اضغط على
                                        <strong> “تحديد موقعي الحالي” </strong>
                                        وسيُطلب منك السماح بالوصول إلى موقعك.
                                    </span>
                                </div>

                                <button
                                    onClick={closeNote}
                                    className="text-yellow-700 hover:text-black font-bold cursor-pointer"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        )}
                    </div>

                    <div ref={mapRef} className="relative h-95">
                        {loadingLocation && (
                            <div className="absolute inset-0 z-10 bg-white/70 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3 font-bold">
                                    <FaCrosshairs className="animate-spin text-2xl" />
                                    جاري تحديد موقعك...
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200 rounded-xl p-8 md:p-10 space-y-8"
                >
                    <h2 className="text-xl font-bold border-r-4 border-black pr-4">
                        بيانات الموقع
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <Input
                            label="الدولة"
                            value={form.country}
                            onChange={(e) => handleChange("country", e.target.value)}
                        />

                        <Input
                            label="المدينة"
                            value={form.city}
                            onChange={(e) => handleChange("city", e.target.value)}
                        />

                        <Input
                            label="المنطقة"
                            value={form.region}
                            onChange={(e) => handleChange("region", e.target.value)}
                        />


                        <Input
                            label="اسم الشارع"
                            value={form.street}
                            onChange={(e) =>
                                handleChange("street", e.target.value)
                            }
                        />

                        <Input
                            label="رابط الموقع"
                            value={form.locationLink}
                            onChange={(e) =>
                                handleChange("locationLink", e.target.value)
                            }
                            placeholder="https://maps.google.com"
                        />

                        <div>
                            <label className="block mb-2 text-sm font-semibold text-slate-700">
                                رقم الهاتف
                            </label>

                            <input
                                dir="ltr"
                                value={form.phone}
                                onChange={(e) =>
                                    handleChange("phone", e.target.value)
                                }
                                onFocus={() => setPhoneFocused(true)}
                                onBlur={() => setPhoneFocused(false)}
                                className="w-full rounded-lg border border-gray-200 bg-gray-100
        focus:outline-none focus:border focus:border-gray-500
        p-3 transition duration-300 ease-in-out text-left"
                                placeholder="+20123456789"
                            />
                            {phoneFocused && (
                                <p className="mt-1 text-xs text-gray-500" dir="ltr">
                                    أدخل رقم الهاتف كاملًا مع كود الدولة (مثال: +20123456789)
                                </p>
                            )}
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block mb-2 text-sm font-semibold text-slate-700">
                                وصف الموقع
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    handleChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-200 bg-gray-100 focus:outline-none focus:border focus:border-gray-500 p-3 transition duration-300 ease-in-out min-h-27.5"
                                placeholder="خلف المجمع التجاري..."
                            />
                        </div>

                    </div>

                    <div className="flex justify-center pt-6">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-linear-to-br from-black to-black/70 cursor-pointer text-white w-full md:w-95 py-3 rounded-md font-bold text-md
                                flex items-center justify-center gap-3 shadow-xl disabled:opacity-60 hover:-translate-y-1 transition duration-300"
                        >
                            {submitting ? (
                                <>
                                    <FaCrosshairs className="animate-spin" />
                                    جاري الحفظ...
                                </>
                            ) : (
                                <>
                                    <FaPlus size={15} /> إضافة العنوان
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

            </div>
        </main>
    );
}

/* ================= INPUT ================= */

function Input({ label, placeholder, value, onChange }) {
    return (
        <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
                {label}
            </label>
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-200 bg-gray-100 focus:outline-none focus:border focus:border-gray-500 p-3 transition duration-300 ease-in-out"
            />
        </div>
    );
}
