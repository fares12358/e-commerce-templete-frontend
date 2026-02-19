"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaShoppingCart,
  FaDollarSign,
  FaStar,
} from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

export default function ProductCard({
  title,
  price,
  image,
  stock,
  code,
  id,
  comparePrice,
  category,
  onAdd,
  star = false
}) {
  const { simple, user } = useAuth()
  const router = useRouter();
  const inStock = stock > 0;
  const [open, setOpen] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied successfully!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group bg-white w-full max-w-sm overflow-hidden rounded-xl p-2 border border-gray-100 shadow-sm hover:shadow-xl transition flex flex-col items-start justify-start"
      dir="rtl"
    >
      {/* Image */}
      <div
        onClick={() => router.push(`/product/${id}`)}
        className="relative h-50 md:h-60 w-full md:aspect-square bg-gray-50 flex items-center justify-center overflow-hidden cursor-pointer mx-auto">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-md"
        />
        {
          star &&
          <span className=" absolute top-0 left-0 bg-white p-2 rounded-br-xl flex items-center justify-center">
            <FaStar className="text-amber-300 text-2xl drop-shadow-md" />
          </span>
        }
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4 w-full">

        {/* Stock + Code */}
        <div className="flex justify-between items-center text-xs font-medium">
          <span
            className={`px-2 py-1 rounded-md font-bold ${inStock
              ? "text-green-600 bg-green-50"
              : "text-red-600 bg-red-50"
              }`}
          >
            {inStock ? "متوفر" : "غير متوفر"} {stock}
          </span>

          <div className="flex text-xs items-center gap-1 text-gray-400 font-bold hover:text-blue-500 cursor-pointer"
            onClick={() => { copyToClipboard(code) }}
          >
            {code}
          </div>
        </div>
        <p className="text-gray-400 text-xs font-semibold">{category}</p>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-700 line-clamp-2 min-h-14">
          {title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {
            comparePrice > price && (
              <del className="text-sm text-gray-400 font-semibold">
                {comparePrice}
              </del>
            )
          }
          <span className="text-md font-semibold text-gray-900 flex items-center">
            {price.toLocaleString()} {simple}
          </span>
        </div>

        {/* Add to cart */}
        <button
          onClick={(e) => {
            if (!user) {
              toast.error('تسجيل الدخول مطلوب')
              return
            }
            e.stopPropagation();
            onAdd();
          }}
          className="mt-2 w-full flex items-center cursor-pointer justify-center gap-3 py-3 rounded-lg bg-linear-to-br from-black to-black/70 text-white font-bold text-sm transition hover:-translate-y-1 ease-in-out"
        >
          <FaShoppingCart />
          أضف إلى العربة
        </button>
      </div>

    </motion.div>
  );
}
