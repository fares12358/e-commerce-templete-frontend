"use client";

import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { FaShoppingBag } from "react-icons/fa";


export default function CategoriesPage() {
  const { setupData } = useAuth()

  if (!setupData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-black/50">لا يوجد محتوى متاح</p>
      </div>
    )
  }
  return (
    <div className="min-h-screen px-6 py-20 max-w-300 mx-auto">
      {/* Heading */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-black text-black mb-3">التصنيفات</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          استكشف مجموعاتنا المصممة بعناية لتناسب ذوقك الراقي
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">


        {
          setupData.categories &&
          setupData.categories.map((cat, i) => (
            <motion.a
              href={`/categories/${cat._id}`}
              key={i}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-4/5 overflow-hidden rounded-xl bg-gray-100 shadow-md">
                <motion.img
                  src={cat.image.url}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center gap-2">
                    <FaShoppingBag />
                    عرض المنتجات
                  </span>
                </div>
              </div>

              <div className="text-center mt-4">
                <h3 className="text-xl font-bold group-hover:text-black transition">
                  {cat.name}
                </h3>
              </div>
            </motion.a>
          ))

        }
      </div>
    </div>
  );
}
