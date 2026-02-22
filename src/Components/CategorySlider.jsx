'use client'
import Link from "next/link";
import { FaArrowAltCircleLeft, FaArrowLeft, FaChevronLeft, FaChevronRight, FaTags } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CategorySlider() {
    const { setupData } = useAuth();

    const sliderRef = useRef(null);
    const [progress, setProgress] = useState(0);

    const scroll = (dir) => {
        const el = sliderRef.current;
        if (!el) return;

        const item = el.firstChild;
        const width = item.offsetWidth + 32; // gap

        el.scrollBy({
            left: dir === "left" ? -width : width,
            behavior: "smooth",
        });
    };

    const updateProgress = () => {
        const el = sliderRef.current;
        if (!el) return;

        const maxScroll = el.scrollWidth - el.clientWidth;

        // Fix RTL browsers behavior
        const scrollLeft = Math.abs(el.scrollLeft);

        const percent = (scrollLeft / maxScroll) * 100;

        setProgress(maxScroll ? percent : 0);
    };

    useEffect(() => {
        updateProgress();
    }, []);

    if (!setupData?.categories) return

    return (
        <section className="mb-16 relative max-w-full">

            <div className="flex flex-col justify-between items-end mb-6 px-2 w-full">
                <div className="mt-10 mb-6 w-full">
                    <h2 className="text-2xl md:text-5xl font-bold flex items-center gap-2 mb-5">
                        <span className="bg-linear-to-br from-gray-500 to-gray-300 p-4 rounded-2xl rotate-12 shadow-sm ml-2">
                            <FaTags className="text-3xl text-white drop-shadow-md -rotate-12" /></span>
                        تسوق حسب الفئة
                    </h2>
                    <p className="text-sm text-gray-500">اكتشف مجموعاتنا المختارة بعناية</p>
                </div>

                <Link href={'/categories'} className="flex items-center justify-center text-xs md:text-[16px] cursor-pointer gap-2 bg-white px-4 py-2 md:py-3 hover:-translate-y-1 duration-300 ease-in-out rounded-md shadow-sm w-fit font-bold hover:text-primary transition">
                    عرض الكل <FaArrowAltCircleLeft className="md:text-xl drop-shadow-md"/>
                </Link>
            </div>

            {/* Arrows (desktop) */}
            <button
                onClick={() => scroll("left")}
                className="hidden md:flex cursor-pointer absolute -left-4 bottom-10 bg-white shadow-md p-2 rounded-full hover:scale-105 transition"
            >
                <FaChevronLeft />
            </button>

            <button
                onClick={() => scroll("right")}
                className="hidden md:flex cursor-pointer absolute -right-4 bottom-10 bg-white shadow-md p-2 rounded-full hover:scale-105 transition"
            >
                <FaChevronRight />
            </button>


            {/* Slider */}
            <div
                ref={sliderRef}
                onScroll={updateProgress}
                className="flex gap-8 overflow-x-auto hide-scrollbar pb-3 md:mx-10 slider-snap scroll-smooth"
            >
                {setupData?.categories.map((cat, i) => (
                    <Link
                        href={`/categories/${cat._id}`}
                        key={i}
                        className="shrink-0 flex flex-col items-center gap-3 group cursor-pointer"
                    >
                        <div className="size-24 rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                            <img
                                src={cat.image.url}
                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                            />
                        </div>

                        <span className="font-bold group-hover:text-primary transition">
                            {cat.name}
                        </span>
                    </Link>
                ))}
            </div>
            {/* Progress bar */}
            {
                progress <= 0 ? '' :
                    <div className="h-1 w-full bg-gray-100/70 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-br from-black/70 to-black/20 transition-all duration-200"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
            }
        </section>
    );
}
