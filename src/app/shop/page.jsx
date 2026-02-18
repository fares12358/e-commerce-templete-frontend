"use client";

import { motion } from "framer-motion";
import CategorySlider from "@/Components/CategorySlider";
import ProductCard from "@/Components/ProductCard";
import SearchBar from "@/Components/SearchBar";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getProducts } from "@/lib/api";
import Loader from "@/Components/Loader";
import { useAuth } from "@/context/AuthContext";
import CartSidePanel from "@/Components/CartSidePanel";

const LIMIT = 20;

export default function ShopPage() {
    const { products, setProducts } = useAuth()
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);

    const openCart = (product) => {
        setActiveProduct(product);
        setOpen(true);
    };

    const loadProducts = async (p = 1) => {
        try {
            setLoading(true);
            const res = await getProducts(p, LIMIT, null);
            // ✅ match backend response
            if (res.success) {
                const { products, pagination } = res.data;
                setProducts(products);
                setTotalPages(pagination.totalPages);
                setPage(pagination.page);
            }
        } catch (err) {
            console.error("PRODUCT LOAD ERROR", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (products.length > 0) return
        loadProducts(1);
    }, []);

    const changePage = (p) => {
        if (p < 1 || p > totalPages || p === page) return;
        loadProducts(p);
    };


    /* Smart page numbers */
    const getPages = () => {
        if (totalPages <= 7)
            return Array.from({ length: totalPages }, (_, i) => i + 1);

        const pages = [1];

        if (page > 3) pages.push("...");

        for (
            let i = Math.max(2, page - 1);
            i <= Math.min(totalPages - 1, page + 1);
            i++
        ) {
            pages.push(i);
        }

        if (page < totalPages - 2) pages.push("...");

        pages.push(totalPages);

        return pages;
    };

    return (
        <main className="container mx-auto px-6 py-10">

            <SearchBar />
            <CategorySlider />

            {/* Products */}
            {loading ? (
                <div className="w-full min-h-screen flex items-center justify-center"><Loader size={30} color="#000" /></div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {
                        products.length > 0 ?
                            products.map((p) => (
                                <ProductCard
                                    key={p._id}
                                    id={p._id}
                                    title={p.name}
                                    price={p.price}
                                    image={p.images[0].url}
                                    code={p.productNumber}
                                    comparePrice={p.comparePrice}
                                    stock={p.stock}
                                    category={p?.categoryId?.name}
                                    onAdd={() => openCart(p)}
                                />
                            ))
                            :
                            <div className="w-full min-h-screen h-full col-span-4 flex items-start pt-20 justify-center text-gray-500 text-xl">لا يوجد منتجات حاليا</div>
                    }
                </div>
            )}


            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 pt-10 select-none flex-wrap mt-auto mb-0">

                    {/* Previous */}
                    <button
                        disabled={page === 1}
                        onClick={() => changePage(page - 1)}
                        className="h-10 px-3 rounded-lg border border-gray-300 text-gray-700 bg-gray-200 hover:bg-gray-100 disabled:opacity-30 transition cursor-pointer"
                    >
                        <FaChevronRight />
                    </button>

                    {/* Pages */}
                    {getPages().map((p, index) =>
                        p === "start-ellipsis" || p === "end-ellipsis" ? (
                            <span key={index} className="px-2 text-gray-400 font-bold">
                                ...
                            </span>
                        ) : (
                            <button
                                key={index}
                                onClick={() => changePage(p)}
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
                        onClick={() => changePage(page + 1)}
                        className="h-10 px-3 rounded-lg border border-gray-300 text-gray-700 bg-gray-200 hover:bg-gray-100 disabled:opacity-30 transition"
                    >
                        <FaChevronLeft />
                    </button>

                </div>
            )}
            {/* ✅ SINGLE GLOBAL SLIDER */}
            {activeProduct && (
                <CartSidePanel
                    open={open}
                    onClose={() => { setOpen(false); setActiveProduct(null) }}
                    selections={activeProduct.selections}
                    id={activeProduct._id}
                    name={activeProduct.name}
                    stock={activeProduct.stock}
                    price={activeProduct.price}
                    comparePrice={activeProduct.comparePrice}
                    image={activeProduct.images[0].url}
                />
            )}
        </main>
    );
}
