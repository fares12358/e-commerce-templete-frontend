"use client";

import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SLIDE_TIME = 4500;

export default function AdsSlider() {
  const { setupData } = useAuth();
  const ads = setupData?.ads || [];

  const [index, setIndex] = useState(0);

  const next = () =>
    setIndex(i => (i + 1) % ads.length);

  const prev = () =>
    setIndex(i => (i - 1 + ads.length) % ads.length);

  // autoplay
  useEffect(() => {
    if (ads.length <= 1) return;

    const timer = setInterval(next, SLIDE_TIME);
    return () => clearInterval(timer);
  }, [ads.length]);

  if (!ads.length) return null;

  const slide = ads[index];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#f5f5f7] mb-5">

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -80 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="flex flex-col md:flex-row items-center p-8 md:p-16"
        >

          {/* Text */}
          <div className="w-full md:w-1/2 space-y-4 text-right order-1 md:order mt-10 md:mt-0">

            <span className="px-4 py-2 black-gradient text-white text-xs font-bold rounded-md">
              {slide.tag}
            </span>

            <h2 className="text-3xl md:text-6xl font-bold mt-5">
              {slide.title}
            </h2>

            <p className="text-gray-600">
              {slide.description}
            </p>

            <Link
              href={slide.link ? `/product/${slide.link}` : "/shop"}
              className="black-gradient px-8 py-2 text-white font-bold rounded-md inline-block hover:-translate-y-1 duration-300 ease-in-out mb-5 md:mb-0"
            >
              تسوق الآن
            </Link>
          </div>

          {/* Image */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 md:mt-10 mt-0 flex justify-center md:order-1"
          >
            <div
              className="w-full max-w-md aspect-square rounded-2xl shadow-2xl bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image.url})` }}
            />
          </motion.div>

        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {ads.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow hover:scale-110 transition"
          >
            <FaChevronRight />
          </button>

          <button
            onClick={next}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-3 rounded-full shadow hover:scale-110 transition"
          >
            <FaChevronLeft />
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-1 bg-gray-300 rounded-full overflow-hidden">
            <motion.div
              key={index}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: SLIDE_TIME / 1000, ease: "linear" }}
              className="h-full black-gradient"
            />
          </div>
        </>
      )}

    </section>
  );
}
