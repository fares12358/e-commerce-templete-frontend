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
    const [totalPages, setTotalPages] = useState(1);
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
                <div className="w-full min-h-[50vh] flex items-center justify-center"><Loader size={30} color="#000" /></div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {products.map((p) => (
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
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 py-12 items-center">

                    <button
                        disabled={page === 1}
                        onClick={() => changePage(page - 1)}
                        className={`w-10 h-10 border rounded-lg flex items-center justify-center
              ${page === 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-black hover:text-white"}`}
                    >
                        <FaChevronRight />
                    </button>

                    {getPages().map((p, i) =>
                        p === "..." ? (
                            <span key={i} className="px-2 text-gray-400">...</span>
                        ) : (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                key={i}
                                onClick={() => changePage(p)}
                                className={`w-10 h-10 rounded-lg font-bold
                  ${page === p
                                        ? "bg-black text-white"
                                        : "border hover:bg-black hover:text-white"}`}
                            >
                                {p}
                            </motion.button>
                        )
                    )}

                    <button
                        disabled={page === totalPages}
                        onClick={() => changePage(page + 1)}
                        className={`w-10 h-10 border rounded-lg flex items-center justify-center
              ${page === totalPages ? "opacity-40 cursor-not-allowed" : "hover:bg-black hover:text-white"}`}
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
