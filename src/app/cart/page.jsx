"use client";

import { motion } from "framer-motion";
import {
    FaPlus,
    FaMinus,
    FaTrash,
    FaBoxOpen,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getCart, updateCart, removeCart, clearCart } from "@/lib/api";
import { toast } from "react-toastify";
import Loader from "@/Components/Loader";
import ConfirmModal from "@/Components/ConfirmModal";

export default function CartPage() {
    const router = useRouter()
    const { user, cart, setCart, setupData, simple } = useAuth()

    const [clearing, setClearing] = useState(false);
    const [loadingItem, setLoadingItem] = useState(false);
    const [loadingQnty, setLoadingQnty] = useState(false);

    const [viewConfirm, setviewConfirm] = useState(false);
    const [confirmType, setConfirmType] = useState(null); // "remove" | "clear"
    const [targetId, setTargetId] = useState(null);

    const [pendingQty, setPendingQty] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [deleting, setDeleting] = useState(false)

    const [loading, setLoading] = useState(false)

    const inc = (itemId, stock) => {
        setPendingQty(prev => {
            if (prev[itemId] >= stock) return prev;

            const updated = { ...prev, [itemId]: prev[itemId] + 1 };
            setHasChanges(true);
            return updated;
        });
    };

    const dec = (itemId) => {
        setPendingQty(prev => {
            if (prev[itemId] <= 1) return prev;

            const updated = { ...prev, [itemId]: prev[itemId] - 1 };
            setHasChanges(true);
            return updated;
        });
    };

    const subtotal = cart.reduce(
        (s, i) => s + i.price * (pendingQty[i.itemId] ?? i.quantity),
        0
    );

    const tax = +(subtotal * (setupData?.config?.vat / 100 || 0)).toFixed(2);
    const total = (subtotal + tax).toFixed(2);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await getCart();
            setCart(res.data.items || []);
            console.log(res.data.items);

        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmAction = async () => {
        try {
            if (confirmType === "remove") {
                setLoadingItem(targetId);
                await removeCart(targetId);
            }
            if (confirmType === "clear") {
                setClearing(true);
                await clearCart();
            }
            await fetchCart();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoadingItem(null);
            setClearing(false);
            setTargetId(null);
            setConfirmType(null);
            setviewConfirm(false);
        }
    };

    const handleSaveChanges = async () => {
        try {
            setDeleting(true)
            for (const item of cart) {
                const newQty = pendingQty[item.itemId];

                if (newQty !== item.quantity) {
                    await updateCart({
                        itemId: item.itemId,
                        quantity: newQty
                    });
                }
            }

            toast.success("تم حفظ التغييرات");
            setHasChanges(false);
            await fetchCart();

        } catch (err) {
            toast.error(err.message);
        } finally {
            setDeleting(false)
        }
    };

    useEffect(() => {
        const map = {};
        cart.forEach(item => {
            map[item.itemId] = item.quantity;
        });
        setPendingQty(map);
    }, [cart]);

    useEffect(() => {
        const changed = cart.some(
            item => (pendingQty[item.itemId] ?? item.quantity) !== item.quantity
        );
        setHasChanges(changed);
    }, [pendingQty, cart]);


    useEffect(() => {
        if (!user) {
            router.push('/');
        } else {
            fetchCart();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-screen">
                <Loader size={30} color="#000" />
            </div>
        )
    }
    if (!user) return

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#f6f6f8] px-4 md:px-12 py-10"
        >
            <div className="max-w-full w-5xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-end pb-8 border-b border-gray-200">
                    <div>
                        <h1 className="text-4xl font-black">عربة التسوق</h1>
                        <p className="text-gray-500 mt-1 font-semibold">
                            راجع منتجاتك قبل إتمام الشراء
                        </p>
                    </div>

                    <span className="text-sm font-semibold uppercase tracking-widest text-gray-600">
                        {cart.length} منتجات
                    </span>
                </div>
                {
                    cart.length > 0 ?

                        <div className="flex flex-col lg:flex-row gap-12 mt-10">

                            {/* Items */}
                            <div className="flex-1 divide-y divide-gray-200">

                                {cart.map((item, i) => (
                                    <motion.div
                                        key={item.itemId}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="grid grid-cols-2 md:grid-cols-3 gap-3 py-8"
                                    >
                                        <img
                                            src={item.image}
                                            onClick={() => { router.push(`/product/${item.productId}`) }}
                                            className="md:size-32 size-28 rounded-xl object-contain border border-gray-50 shadow-sm cursor-pointer hover:scale-105 transition duration-300 ease-in-out"
                                        />
                                        <div className="w-full md:col-span-2">
                                            <div className="flex gap-2 justify-between">
                                                <div className="gap-1 flex flex-col">
                                                    <p className="text-xs md:text-sm font-bold">{item.name}</p>
                                                    <div className="text-gray-500 text-sm border-t border-gray-200 pt-1 mt-1">
                                                        {item.selections.map((select, i) => (
                                                            <div key={i} className="flex gap-2 font-semibold">
                                                                <span>{select.name}:</span>
                                                                <span className="text-gray-800">{select.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-lg font-bold hidden sm:block w-full">
                                                    {(item.price *  (pendingQty[item.itemId] ?? item.quantity)).toLocaleString()} {simple}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-center mt-6">
                                                <div className="flex items-center border border-gray-300 text-gray-500 rounded-md p-1 gap-2">
                                                    {
                                                        loadingQnty === item.itemId ?
                                                            <div className="w-full h-full min-h-8 min-w-25 flex items-center justify-center">
                                                                <Loader size={14} color="#666" />
                                                            </div>
                                                            :
                                                            <>
                                                                <button
                                                                    disabled={loadingQnty === item.productId}
                                                                    onClick={() => dec(item.itemId, item.quantity)}
                                                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded cursor-pointer"
                                                                >
                                                                    <FaMinus />
                                                                </button>

                                                                <span className="font-bold w-6 text-center">
                                                                    {pendingQty[item.itemId] ?? item.quantity}
                                                                </span>

                                                                <button
                                                                    disabled={(pendingQty[item.itemId] ?? item.quantity) >= item.stock}
                                                                    onClick={() => inc(item.itemId, item.stock)}
                                                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded cursor-pointer"
                                                                >
                                                                    <FaPlus />
                                                                </button>
                                                            </>
                                                    }
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setConfirmType("remove");
                                                        setTargetId(item.itemId)
                                                        setviewConfirm(true);
                                                    }}
                                                    disabled={loadingItem === item.itemId}
                                                    className="sm:flex hidden items-center gap-1 cursor-pointer text-gray-400 hover:text-red-500 text-sm font-bold uppercase"
                                                >
                                                    {loadingItem === item.itemId ? (
                                                        <Loader size={14} color="#999" />
                                                    ) : (
                                                        <>
                                                            <FaTrash /> إزالة
                                                        </>
                                                    )}

                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex sm:hidden items-center justify-evenly w-full col-span-3">
                                            <p className="text-lg font-bold">
                                                {(item.price * (pendingQty[item.itemId] ?? item.quantity)).toLocaleString()} {simple}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setConfirmType("remove");
                                                    setTargetId(item.itemId)
                                                    setviewConfirm(true);
                                                }}
                                                disabled={loadingItem === item.itemId}
                                                className="flex items-center gap-1 cursor-pointer text-gray-400 hover:text-red-500 text-sm font-bold uppercase"
                                            >
                                                {loadingItem === item.itemId ? (
                                                    <Loader size={14} color="#999" />
                                                ) : (
                                                    <>
                                                        <FaTrash /> إزالة
                                                    </>
                                                )}

                                            </button>
                                        </div>

                                    </motion.div>
                                ))}
                            </div>

                            {/* Summary */}
                            <div className="w-full h-fit lg:w-96 bg-white rounded-lg border border-gray-200 p-8 space-y-6">
                                <div className="flex gap-3">
                                    {hasChanges && (
                                        <motion.button
                                            disabled={deleting}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={handleSaveChanges}
                                            className="flex-1 py-2 rounded-md relative bg-linear-to-br from-black to-black/70 text-white font-bold hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer"
                                        >
                                            {
                                                deleting ? <span className=" w-full h-full flex items-center justify-center"><Loader size={20} color="#fff" /></span>
                                                    :
                                                    "حفظ التغييرات"
                                            }
                                            <div className="absolute z-10 -top-1 -right-1 flex size-3">
                                                <span className="w-3 h-3 absolute bg-green-500 rounded-full animate-ping"></span>
                                                <span className="w-3 h-3 absolute bg-green-500 rounded-full"></span>
                                            </div>
                                        </motion.button>
                                    )}

                                    <button
                                        onClick={() => {
                                            setConfirmType("clear");
                                            setviewConfirm(true);
                                        }}
                                        className="flex-1 py-2 rounded-md border border-gray-300 text-sm font-bold cursor-pointer hover:-translate-y-1 duration-300 ease-in-out text-gray-500 transition"
                                    >
                                        {clearing ? <span className="flex items-center justify-center w-full h-full"> <Loader size={20} color="#555" /> </span> : "تفريغ السلة"}
                                    </button>
                                </div>

                                <h3 className="text-xl font-black uppercase">
                                    ملخص الطلب
                                </h3>

                                <div className="space-y-4 border-b pb-6">
                                    <Row label="المجموع الفرعي" value={`${subtotal.toLocaleString()} ${simple}`} />
                                    {
                                        setupData?.config?.vat > 0 && (
                                            <Row label={`الضريبة التقديرية(${setupData?.config?.vat}%) `} value={`${tax.toLocaleString()} ${simple}`} />
                                        )
                                    }
                                </div>

                                <div className="flex justify-between text-xl font-black">
                                    <span>الإجمالي</span>
                                    <span>{total.toLocaleString()} {simple}</span>
                                </div>
                                {
                                    setupData?.config?.shipment > 0 || setupData?.config?.shipment && (
                                        <div className="flex items-center justify-between font-semibold text-gray-500">
                                            <p className="">الشحن</p>
                                            <p className="">{setupData?.config?.shipment} {simple}</p>
                                        </div>
                                    )
                                }

                                <motion.button
                                    onClick={() => { router.push('/checkout') }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full py-3 cursor-pointer rounded-md bg-linear-to-br from-black to-black/70 text-white hover:-translate-y-1 transition-all duration-300 ease-in-out font-black uppercase tracking-widest flex items-center justify-center gap-3"
                                >
                                    <FaBoxOpen />
                                    إتمام الشراء

                                </motion.button>
                            </div>

                        </div>
                        :
                        <div className="text-md font-semibold text-gray-500 w-full min-h-[50vh] flex items-center justify-center">لا توجد منتجات تسوق واضف ما تريد</div>
                }
            </div>
            <ConfirmModal
                open={viewConfirm}
                title={confirmType === "clear" ? "تفريغ السلة" : "إزالة منتج"}
                message={
                    confirmType === "clear"
                        ? "هل تريد تفريغ السلة بالكامل؟"
                        : "هل تريد إزالة هذا المنتج من السلة؟"
                }
                onConfirm={handleConfirmAction}
                onCancel={() => setviewConfirm(false)}
                loading={confirmType === "clear" ? clearing : loadingItem === targetId}
                icon={<FaTrash size={25} className="text-red-500" />}
            />
        </main>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between text-base font-medium">
            <span className="text-gray-500">{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
    );
}
