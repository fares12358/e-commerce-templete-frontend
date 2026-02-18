"use client";

import { addToCart } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { useAuth } from "@/context/AuthContext";

export default function CartSidePanel({
    selections,
    id,
    name,
    stock,
    price,
    image,
    open,
    comparePrice,
    onClose
}) {
  const { simple } = useAuth()
    const [quantity, setQuantity] = useState(1);
    const [selected, setSelected] = useState({});
    const [loading, setLoading] = useState(false)
    const handleSelect = (name, value) => {
        setSelected(prev => ({ ...prev, [name]: value }));
    };
    const handleAdd = async () => {
        if (quantity > stock) {
            toast.error("الكمية غير متاحة");
            return;
        }

        if (selections?.length) {
            for (const sel of selections) {
                if (!selected[sel.name]) {
                    toast.error(`اختر ${sel.name} أولاً`);
                    return;
                }
            }
        }
        const selectionsPayload = Object.entries(selected).map(
            ([name, value]) => ({ name, value })
        );
        try {
            setLoading(true)
            const res = await addToCart({
                productId: id,
                quantity,
                selections: selectionsPayload
            });
            if (res.success) {
                toast.success("تمت إضافة المنتج إلى السلة 🛒");
                onClose();
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);

            toast.error("حدث خطأ أثناء الإضافة");
        } finally {
            setLoading(false)
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <motion.div
                        className="fixed inset-0 bg-black/40 z-40"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25 }}
                        className="fixed top-0 right-0 h-screen w-full sm:w-[420px] bg-white z-50 p-6 overflow-y-auto"
                        dir="rtl"
                    >
                        {/* Product Image */}
                        <div className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                            <img
                                src={image}
                                alt={name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <h2 className="text-md font-bold mb-2">{name}</h2>

                        <div className="text-sm font-semibold text-gray-500 mb-1">
                            المخزون: {stock}
                        </div>

                        <div className="text-2xl flex items-center gap-1 font-semibold text-green-600 mb-4">
                            {
                                comparePrice > price && (
                                    <del className="text-sm text-gray-400 font-semibold">
                                        {comparePrice}
                                    </del>
                                )
                            }
                            {price} {simple}
                        </div>

                        {/* Quantity Stepper */}
                        <div className="mb-6">
                            <label className="font-semibold block mb-2">الكمية</label>

                            <div className="flex items-center max-w-full w-[200px] justify-between border border-gray-200 bg-gray-100 text-gray-400 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="px-4 py-2 text-xl font-bold hover:bg-gray-200 cursor-pointer"
                                >
                                    −
                                </button>

                                <span className="px-6 font-semibold text-lg">
                                    {quantity}
                                </span>

                                <button
                                    onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                                    className="px-4 py-2 text-xl font-bold hover:bg-gray-200 cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Selections */}
                        {selections?.map(sel => (
                            <div key={sel._id} className="mb-5">
                                <p className="font-semibold mb-2">{sel.name}</p>

                                <div className="flex flex-wrap gap-2">
                                    {sel.options.map(opt => (
                                        <button
                                            key={opt._id}
                                            onClick={() => handleSelect(sel.name, opt.value)}
                                            className={`px-4 py-2 rounded-lg border border-gray-200 cursor-pointer transition ${selected[sel.name] === opt.value
                                                ? "bg-linear-to-br from-black to-black/70 text-white"
                                                : "bg-gray-50 hover:bg-gray-200"
                                                }`}
                                        >
                                            {opt.value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Actions */}
                        <div className="mt-8 flex gap-3">
                            <button
                                disabled={loading}
                                onClick={handleAdd}
                                className="flex-1 flex items-center justify-center gap-2 cursor-pointer bg-linear-to-br from-black to-black/70 text-white py-3 rounded-md font-bold"
                            >
                                {
                                    loading ?
                                        <span className="flex items-center justify-center w-full h-full"><Loader size={20} color="#fff" /></span>
                                        :
                                        <>
                                            <FaShoppingCart />
                                            إضافة للسلة
                                        </>
                                }
                            </button>

                            <button
                                disabled={loading}
                                onClick={onClose}
                                className="flex-1 border border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer py-3 rounded-lg font-bold"
                            >
                                إلغاء
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
