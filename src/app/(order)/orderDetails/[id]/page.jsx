"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getOrderById, cancelOrder, getInvoice } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

import {
  FaCheckCircle,
  FaCog,
  FaTruck,
  FaBox,
  FaMapMarkerAlt,
  FaWallet,
  FaPrint,
  FaBoxOpen,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";
import Loader from "@/Components/Loader";

const steps = [
  { key: "ordered", label: "تم الطلب", icon: FaCheckCircle },
  { key: "processing", label: "قيد التجهيز", icon: FaCog },
  { key: "shipped", label: "تم الشحن", icon: FaTruck },
  { key: "delivered", label: "تم التوصيل", icon: FaBox },
];

const statusToStep = {
  pending: "ordered",
  confirmed: "processing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "ordered",
};


function Timeline({ current, status }) {
  // 🛑 حالة الإلغاء
  if (status === "cancelled") {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-8 mb-10 text-center space-y-4">
        <div className="mx-auto size-14 rounded-full bg-red-500 text-white flex items-center justify-center text-2xl">
          <FaTimes />
        </div>

        <h3 className="text-2xl font-bold text-red-600">
          تم إلغاء الطلب
        </h3>

        <p className="text-slate-500">
          تم إلغاء هذا الطلب ولن يتم شحنه
        </p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 mb-10">
      <div className="flex flex-col md:flex-row gap-6 justify-between">

        {steps.map((step, i) => {
          const active = steps.findIndex(s => s.key === current) >= i;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-row md:flex-col gap-4 flex-1 items-center">

              <div className="flex flex-col items-center">
                <div
                  className={`size-10 rounded-full flex items-center justify-center border ${active
                    ? "bg-black text-white border-black"
                    : "bg-white text-slate-300 border-slate-300"
                    }`}
                >
                  <Icon />
                </div>

                {i !== steps.length - 1 && (
                  <div className={`hidden md:block w-px h-6 mt-2 ${active ? "bg-black" : "bg-slate-300"}`} />
                )}
              </div>

              <div className="md:text-center">
                <p className={`font-bold ${active ? "text-black" : "text-slate-300"}`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, children }) {
  return (
    <motion.div
      className="bg-white border border-slate-200 rounded-xl p-6 space-y-3"
    >
      <div className="size-12 rounded-lg bg-black text-white flex items-center justify-center">
        <Icon />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <div className="text-slate-600 text-sm">{children}</div>
    </motion.div>
  );
}

function ProductRow({ name, meta, qty, price, simple }) {
  return (
    <div className="flex justify-start flex-col items-start py-6 border-b border-slate-200 last:border-none">
      <h4 className="font-bold text-gray-700">{name}</h4>
      <p className="text-sm text-gray-700">{meta}</p>
      <p className="text-sm mt-1">الكمية: {qty}</p>
      <p className="font-bold text-xl mt-2">{price} {simple}</p>
    </div>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { orders, user, simple } = useAuth();
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const currentStatus = statusToStep[order?.status] || "ordered";
  const [invoceLoading, setInvoceLoading] = useState(false)

  const fetchOrder  = async () => {
    try {
      setLoading(true);
      // 2️⃣ fallback API
      const res = await getOrderById(id);
      setOrder(res.data);

    } catch (err) {
      toast.error(err.message);
      router.push("/myOrders");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) fetchOrder();
  }, [id, orders]);

  const handleCancelOrder = async () => {
    if (order.status !== "pending") return;

    try {
      setCancelLoading(true);

      await cancelOrder(order._id);

      setOrder(prev => ({
        ...prev,
        status: "cancelled"
      }));

      toast.success("تم إلغاء الطلب بنجاح");

    } catch (err) {
      toast.error("فشل إلغاء الطلب");
    } finally {
      setCancelLoading(false);
    }
  };
  const HandlegetInvoice = async () => {
    try {
      setInvoceLoading(true)
      const res = await getInvoice(id);
      if (res.seuccess) {
        toast.success(res.message)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setInvoceLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader size={30} color="#000" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center text-gray-400">
        الطلب غير موجود
      </div>
    );
  }

  return (
    <main dir="rtl" className="container mx-auto px-4 py-12 space-y-12 min-h-screen">

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-4 rounded-full bg-black text-white text-4xl"><FaBoxOpen /></div>
        <h1 className="text-3xl font-bold">
          تفاصيل الطلب #{order.orderNumber}
        </h1>

        {order.status === "cancelled" && (
          <span className="inline-block mt-2 px-4 py-1 rounded-md bg-red-100 text-red-600 font-bold text-sm">
            تم إلغاء الطلب
          </span>
        )}

        <p className="text-slate-500">
          تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString("ar-EG")}
        </p>

      </div>

      {/* Timeline */}
      <Timeline current={currentStatus} status={order.status} />


      {/* Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <InfoCard icon={FaMapMarkerAlt} title="عنوان الشحن">
          {order.location ? (
            <>
              {order.location.locationDescription && (
                <>
                  {order.location.locationDescription}
                  <br />
                </>
              )}

              {order.location.strName && (
                <>
                  شارع {order.location.strName}
                  <br />
                </>
              )}

              {order.location.government && (
                <>
                  {order.location.government} - {order.location.city}
                  <br />
                </>
              )}

              {order.location.country && (
                <>
                  {order.location.country}
                  <br />
                </>
              )}

              {order.location.phone && (
                <span className="block mt-1">
                  الهاتف: {order.location.phone}
                </span>
              )}

              {order.location.locationLink && (
                <a
                  href={order.location.locationLink}
                  target="_blank"
                  className="text-black font-bold hover:underline block mt-2"
                >
                  عرض الموقع على الخريطة
                </a>
              )}
            </>
          ) : (
            <span className="text-slate-400">لا يوجد عنوان مسجل</span>
          )}
        </InfoCard>

        <InfoCard icon={FaWallet} title="طريقة الدفع">
          {order.paymentMethod === "cash"
            ? "الدفع عند الاستلام"
            : order.paymentMethod}
          <p className="text-xs italic mt-1">يتم التحصيل عند التسليم</p>
        </InfoCard>
      </div>

      {/* Products */}
      <section className="bg-white rounded-xl border border-slate-200 p-8">
        <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-4">
          المنتجات ({order.items.length})
        </h2>

        {order.items.map((item) => (
          <ProductRow
            key={item._id}
            name={item.name}
            meta={
              item.selections?.length
                ? item.selections.map(s => `${s.name}: ${s.value}`).join(" - ")
                : "—"
            }
            qty={item.quantity}
            price={`${(item.price * item.quantity).toLocaleString()}`}
            simple={simple}
          />
        ))}
      </section>

      {/* Summary */}
      <motion.div
        className="bg-white rounded-xl border border-slate-200 p-8 "
      >
        <div className="space-y-3 text-slate-600">
          <div className="flex justify-between text-xl font-bold text-black">
            <span>الإجمالي</span>
            <span>{order.totalPrice.toLocaleString()} {simple}</span>
          </div>
          {
            order.shippingFee &&
            <div className="flex justify-between">
              <span>الشحن</span>
              <span>{order.shippingFee.toLocaleString()} {simple}</span>
            </div>
          }
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-5 pt-6 border-t border-gray-200 mt-6">
          {order.status !== "cancelled" && (
            <button
              onClick={HandlegetInvoice}
              className="w-full bg-linear-to-br from-black to-black/70 text-white py-3 rounded-lg cursor-pointer font-bold flex items-center justify-center gap-2 hover:-translate-y-1 duration-300 transition ease-in-out">
              {
                invoceLoading ?
                  <span className="w-full h-full flex items-center justify-center"><Loader size={25} color="#fff" /></span>
                  :
                  <>
                    <FaPrint /> طلب الفاتورة
                  </>
              }
            </button>
          )}

          {order.status === "pending" && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelLoading}
              className="w-full bg-linear-to-br to-red-400 from-red-700 text-white py-3 cursor-pointer rounded-lg font-bold hover:bg-red-50 hover:-translate-y-1 duration-300 transition ease-in-out"
            >
              {cancelLoading ? "جاري الإلغاء..." : "إلغاء الطلب"}
            </button>
          )}
        </div>

      </motion.div>

      {/* Help */}
      <p className="text-center text-slate-500">
        هل لديك استفسار؟{" "}
        <Link href={'/contact'} className="font-bold text-black cursor-pointer hover:underline">
          تواصل معنا
        </Link>
      </p>
    </main>
  );
}
