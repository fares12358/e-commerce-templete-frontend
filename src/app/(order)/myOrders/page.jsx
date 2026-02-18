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
import Loader from "@/Components/Loader";
import { useRouter } from "next/navigation";

const statusStyles = {
  pending: " bg-linear-to-br from-yellow-700 to-yellow-400 text-white",
  delivered: " bg-linear-to-br from-green-700 to-green-400 text-white",
  cancelled: " bg-linear-to-br from-red-700 to-red-400 text-white",
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

function OrderCard({ order, simple }) {
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
            {totalPrice.toLocaleString()} {simple}
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
  const { orders, setOrders, user, simple } = useAuth();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("new");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        sort,
      };

      if (filter !== "all") params.status = filter;
      if (search) params.orderNumber = search;
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
  }, [filter, sort, page, search]);

  // 🔥 Pagination Logic
  const getVisiblePages = () => {
    const pages = [];
    const siblingCount = 2; // عدد الصفحات حول الصفحة الحالية

    const start = Math.max(2, page - siblingCount);
    const end = Math.min(totalPages - 1, page + siblingCount);

    // أول صفحة
    pages.push(1);

    // نقاط قبل
    if (start > 2) pages.push("start-ellipsis");

    // الصفحات حول الحالية
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // نقاط بعد
    if (end < totalPages - 1) pages.push("end-ellipsis");

    // آخر صفحة
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user]);

  return (
    <main dir="rtl" className="container min-h-screen mx-auto px-4 py-12 space-y-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FaBoxOpen size={25} />
        <h1 className="text-3xl font-bold">طلباتي</h1>
      </div>

      {/* Search */}
      <div className="relative flex">
        <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          className="w-full h-14 pr-12 pl-4 rounded-tr-md rounded-br-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-200 shadow-sm"
          placeholder="ابحث عن رقم الطلب"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button
          onClick={() => {
            setPage(1);
            setSearch(searchTerm);
          }}
          className="bg-linear-to-br from-black to-black/70 py-4 px-6 rounded-tl-md rounded-bl-md font-semibold shadow-md text-white cursor-pointer hover:-translate-y-1 transition ease-in-out duration-300"
        >
          بحث
        </button>
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
        <div className="w-full min-h-[50vh] flex items-center justify-center"><Loader size={30} color="#000" /></div>
      ) : orders?.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} simple={simple} />
          ))}
        </div>
      ) : (
        <p className="text-center py-20 text-slate-400">
          لا توجد طلبات
        </p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 pt-10 select-none flex-wrap mt-auto mb-0">

          {/* Previous */}
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
            className="h-10 px-3 rounded-lg border border-gray-300 text-gray-700 bg-gray-200 hover:bg-gray-100 disabled:opacity-30 transition cursor-pointer"
          >
            <FaChevronRight />
          </button>

          {/* Pages */}
          {getVisiblePages().map((p, index) =>
            p === "start-ellipsis" || p === "end-ellipsis" ? (
              <span key={index} className="px-2 text-gray-400 font-bold">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setPage(p)}
                className={`min-w-10 h-10 px-3 rounded-lg font-bold text-sm transition-all duration-200 cursor-pointer
            ${page === p
                    ? "bg-linear-to-br from-black to-black/70 text-white shadow-sm scale-105"
                    : "border border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {p}
              </button>
            )
          )}

          {/* Next */}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => prev + 1)}
            className="h-10 px-3 rounded-lg border border-gray-300 text-gray-700 bg-gray-200 hover:bg-gray-100 disabled:opacity-30 transition"
          >
            <FaChevronLeft />
          </button>

        </div>
      )}

    </main>
  );
}
