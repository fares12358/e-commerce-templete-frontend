"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaPhone,
  FaTrash,
  FaPlus,
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";

import {
  getLocation,
  deleteLocation,
  setDefaultLocation,
} from "@/lib/api";

import { toast } from "react-toastify";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AddressesPage() {
  const { user, addresses, setAddresses } = useAuth()
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // delete | default
  const [selectedId, setSelectedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();
  /* ================= GET LOCATIONS ================= */
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


  /* ================= OPEN MODAL ================= */
  const openDeleteModal = (id) => {
    setSelectedId(id);
    setModalType("delete");
    setModalOpen(true);
  };

  const openDefaultModal = (id) => {
    setSelectedId(id);
    setModalType("default");
    setModalOpen(true);
  };

  /* ================= CONFIRM ACTION ================= */
  const handleConfirm = async () => {
    try {
      setActionLoading(true);

      let res;

      if (modalType === "delete") {
        res = await deleteLocation(selectedId);
        toast.success("تم حذف العنوان بنجاح");
      }

      if (modalType === "default") {
        res = await setDefaultLocation(selectedId);
        toast.success("تم تعيين العنوان كافتراضي");
      }

      if (res?.success) {
        setAddresses(res.data);
      }

      setModalOpen(false);
      setSelectedId(null);
      setModalType(null);

    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    if (addresses.length > 0) return
    fetchLocations();
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user])

  return (
    <main dir="rtl" className="min-h-screen bg-white px-4 py-14">

      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-2">عناويني</h1>
        <p className="text-gray-500">
          إدارة عناوين الشحن الخاصة بك بكل سهولة
        </p>
      </div>

      {/* Add Button */}
      <div className="container mx-auto flex justify-end mb-10">
        <button
          onClick={() => (router.push("/addAddress"))}
          className="bg-linear-to-br from-black to-black/70 text-white px-8 py-3 cursor-pointer rounded-lg font-bold flex items-center gap-2 hover:-translate-y-1 duration-300 transition"
        >
          <FaPlus /> إضافة عنوان جديد
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-gray-200 animate-pulse space-y-4"
            >
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      )}


      {/* Empty */}
      {!loading && addresses.length === 0 && (
        <div className="text-center text-gray-500 font-bold">
          لا توجد عناوين محفوظة حتى الآن
        </div>
      )}

      {/* Cards */}
      <div className="container mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          addresses.map((addr) => (
            <motion.div
              key={addr._id}
              className={`p-6 rounded-xl flex flex-col justify-between transition-all duration-300 shadow-sm
              ${addr.default
                  ? "border border-t-gray-200 border-l-gray-200 border-r-6 border-b-6 border-black  shadow-md"
                  : "border border-gray-200 "
                }`}
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-extrabold flex items-center gap-2">
                    {addr.default && (
                      <span className="text-xs bg-linear-to-br from-black to-black/70 text-white flex items-center justify-center gap-1 px-4 py-2 rounded-md shadow-md">
                        <FaStar /> افتراضي
                      </span>
                    )}
                    {addr.strName || "عنوان بدون اسم"}
                  </h3>
                  <FaMapMarkerAlt className="text-blue-400 text-2xl" />
                </div>

                {/* Address */}
                <div className="space-y-1 mb-6 text-sm text-gray-800">
                  <p className="font-medium">{addr.country}</p>
                  <p>{addr.city} - {addr.government}</p>

                  {addr.locationDescription && (
                    <p className="text-gray-600 text-xs">
                      {addr.locationDescription}
                    </p>
                  )}

                  {addr.locationLink && (
                    <a
                      href={addr.locationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-linear-to-br from-blue-600 to-blue-400 text-white py-2 px-4 shadow-sm w-fit flex items-center justify-start rounded-md gap-1 hover:-translate-y-1 transition duration-300"
                    >
                      <FaMapMarkerAlt />
                      عرض على الخريطة
                    </a>
                  )}
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <FaPhone className="text-sm" />
                  <span dir="ltr">{addr.phone}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-100">

                {!addr.default && (
                  <button
                    onClick={() => openDefaultModal(addr._id)}
                    className="flex items-center gap-1 font-bold text-sm py-2 px-3 rounded-md cursor-pointer text-white bg-linear-to-br from-yellow-700 to-yellow-500 transition hover:-translate-y-1 duration-300"
                  >
                    <FaStar /> تعيين كافتراضي
                  </button>
                )}

                <button
                  onClick={() => openDeleteModal(addr._id)}
                  className="flex items-center gap-1 font-bold text-sm text-red-500 hover:text-red-700 transition cursor-pointer duration-300 transition "
                >
                  <FaTrash /> حذف
                </button>
              </div>
            </motion.div>
          ))}
      </div>

      {/* ================= CONFIRM MODAL ================= */}
      <ConfirmModal
        open={modalOpen}
        loading={actionLoading}
        onCancel={() => {
          if (!actionLoading) setModalOpen(false);
        }}
        onConfirm={handleConfirm}
        icon={
          modalType === "delete"
            ? <FaTrash className="text-red-500 text-4xl" />
            : <FaStar className="text-yellow-500 text-4xl" />
        }
        title={
          modalType === "delete"
            ? "حذف العنوان"
            : "تعيين كعنوان افتراضي"
        }
        message={
          modalType === "delete"
            ? "هل أنت متأكد من حذف هذا العنوان؟ لا يمكن التراجع بعد ذلك."
            : "هل تريد تعيين هذا العنوان كعنوان افتراضي؟"
        }
      />

    </main>
  );
}
