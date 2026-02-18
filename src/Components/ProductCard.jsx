"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaShoppingCart,
  FaDollarSign,
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
  onAdd
}) {
  const { simple } = useAuth()
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
      className="group bg-white w-full max-w-sm overflow-hidden rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition"
      dir="rtl"
    >
      {/* Image */}
      <div
        onClick={() => router.push(`/product/${id}`)}
        className="relative aspect-square bg-gray-50 flex items-center justify-center p-8 overflow-hidden cursor-pointer">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-4">

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
            {price} {simple}
          </span>
        </div>

        {/* Add to cart */}
        <button
          onClick={(e) => {
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
