"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaBoxOpen,
} from "react-icons/fa";
import { getOrders } from "@/lib/api";
import { toast } from "react-toastify";
import CustomSelect from "@/Components/CustomSelect";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const statusStyles = {
  pending: " bg-linear-to-br from-yellow-700 to-yellow-400 text-white",
  delivered: " bg-linear-to-br from-green-700 to-green-400 text-white",
  cancelled: " bg-linear-to-br from-rose-700 to-rose-400 text-white",
  confirmed: " bg-linear-to-br from-blue-700 to-blue-400 text-white",
  shipped: " bg-linear-to-br from-fuchsia-700 to-fuchsia-400 text-white",
};

const statusOptions = [
  { value: "all", label: "كل الطلبات" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "confirmed", label: "قيد التجهيز" },
  { value: "shipped", label: "تم الشحن" },
  { value: "delivered", label: "تم التوصيل" },
  { value: "cancelled", label: "تم الإلغاء" },
];

const sortOptions = [
  { value: "new", label: "الأحدث أولاً" },
  { value: "old", label: "الأقدم أولاً" },
];


function OrderCard({ order }) {
  const { orderNumber, status, createdAt, items, totalPrice, paymentMethod, _id } = order;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const totalItems = items?.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <motion.div
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">رقم الطلب</p>
          <h2 className="text-lg md:text-xl font-bold tracking-wide">
            #{orderNumber}
          </h2>
        </div>
        
        <span
          className={`px-4 py-2 w-fit rounded-md text-xs font-bold whitespace-nowrap ${statusStyles[status]}`}
        >
          {status === "pending" && "قيد الانتظار"}
          {status === "delivered" && "تم التوصيل"}
          {status === "cancelled" && "تم الالغاء"}
          {status === "confirmed" && "تم التاكيد"}
          {status === "shipped" && "تم الشحن"}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed"></div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <p className="text-slate-400 text-xs mb-1">التاريخ</p>
          <p className="font-semibold">{formatDate(createdAt)}</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-1">عدد المنتجات</p>
          <p className="font-semibold">{totalItems} منتج</p>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-1">طريقة الدفع</p>
          <p className="font-semibold">
            {paymentMethod === "cash"
              ? "الدفع عند الاستلام"
              : paymentMethod}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-xs mb-1">الإجمالي</p>
          <p className="text-lg font-bold text-black">
            {totalPrice.toLocaleString()} ر.س
          </p>
        </div>
      </div>

      {/* Action */}
      <div className="flex justify-end pt-4">
        <Link href={`/orderDetails/${_id}`} className="px-6 py-2 rounded-md cursor-pointer bg-linear-to-br from-black to-black/70 text-white text-sm font-bold hover:-translate-y-1 duration-300 transition">
          عرض التفاصيل
        </Link>
      </div>
    </motion.div>
  );
}
export default function MyOrdersPage() {
  const {orders, setOrders } = useAuth();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("new");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        sort,
      };

      if (filter !== "all") params.status = filter;

      const res = await getOrders(params);

      setOrders(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      toast.error("فشل تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filter, sort, page]);

  // 🔥 Pagination Logic
  const renderPagination = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, 3);

      if (page > 4) {
        pages.push("...");
      }

      if (page > 3 && page < totalPages - 2) {
        pages.push(page);
      }

      if (page < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages - 2, totalPages - 1, totalPages);
    }
    return pages;
  };

  return (
    <main dir="rtl" className="container min-h-screen mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FaBoxOpen size={25} />
        <h1 className="text-3xl font-bold">طلباتي</h1>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full h-14 pr-12 pl-4 rounded-md bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-200 shadow-sm"
          placeholder="ابحث عن رقم الطلب"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filters + Sort */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-start gap-4">

        {/* Filter */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-500">الحالة:</span>
          <CustomSelect
            value={filter}
            options={statusOptions}
            placeholder="اختر الحالة"
            onChange={(val) => {
              setFilter(val);
              setPage(1);
            }}
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-500">الترتيب:</span>
          <CustomSelect
            value={sort}
            options={sortOptions}
            placeholder="ترتيب الطلبات"
            onChange={(val) => {
              setSort(val);
              setPage(1);
            }}
          />
        </div>

      </div>


      {/* Orders */}
      {loading ? (
        <p className="text-center py-20">جاري التحميل...</p>
      ) : orders?.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <p className="text-center py-20 text-slate-400">
          لا توجد طلبات
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="size-10 border rounded-lg disabled:opacity-40"
          >
            <FaChevronRight />
          </button>

          {renderPagination().map((p, index) =>
            p === "..." ? (
              <span key={index} className="px-2">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setPage(p)}
                className={`size-10 rounded-lg font-bold ${page === p
                  ? "bg-black text-white"
                  : "border"
                  }`}
              >
                {p}
              </button>
            )
          )}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="size-10 border rounded-lg disabled:opacity-40"
          >
            <FaChevronLeft />
          </button>
        </div>
      )}
    </main>
  );
}
