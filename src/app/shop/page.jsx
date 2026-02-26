"use client";

import CategorySlider from "@/Components/CategorySlider";
import ProductCard from "@/Components/ProductCard";
import SearchBar from "@/Components/SearchBar";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getProducts } from "@/lib/api";
import Loader from "@/Components/Loader";
import { useAuth } from "@/context/AuthContext";
import CartSidePanel from "@/Components/CartSidePanel";
import CustomSelect from "@/Components/CustomSelect";

const LIMIT = 20;
const SORT_OPTIONS = [
    { label: "الأحدث", value: "new" },
    { label: "الأقدم", value: "old" },
    { label: "السعر: من الأقل للأعلى", value: "price_asc" },
    { label: "السعر: من الأعلى للأقل", value: "price_desc" }
];


export default function ShopPage() {
    const { products, setProducts, setupData, shopPag, setShopPag } = useAuth()
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState(null);
    const [sort, setSort] = useState(null);

    const openCart = (product) => {
        setActiveProduct(product);
        setOpen(true);
    };

    const loadProducts = async (p = shopPag.page, currentSort = sort) => {

        // ❌ لا تستخدم الكاش إذا تغير الـ sort
        const cacheKey = `${p}_${currentSort || "default"}`;

        if (products[cacheKey]) {
            setShopPag(prev => ({ ...prev, page: p }));
            return;
        }

        try {
            setLoading(true);

            const res = await getProducts(p, LIMIT, null, currentSort);

            if (res.success) {
                const { products: newProducts, pagination } = res.data;

                setProducts(prev => ({
                    ...prev,
                    [cacheKey]: newProducts
                }));

                setShopPag(prev => ({
                    ...prev,
                    page: pagination.page,
                    totalPages: pagination.totalPages
                }));
            }

        } catch (err) {
            console.error("PRODUCT LOAD ERROR", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (products[1]) return;
        loadProducts(1);
    }, []);

    const changePage = (p) => {
        if (p < 1 || p > shopPag.totalPages || p === shopPag.page) return;
        loadProducts(p);
    };

    /* Smart page numbers */
    const getPages = () => {
        const total = shopPag.totalPages;
        const current = shopPag.page;

        if (total <= 7)
            return Array.from({ length: total }, (_, i) => i + 1);

        const pages = [1];

        if (current > 3) pages.push("...");

        for (
            let i = Math.max(2, current - 1);
            i <= Math.min(total - 1, current + 1);
            i++
        ) {
            pages.push(i);
        }

        if (current < total - 2) pages.push("...");

        pages.push(total);

        return pages;
    };

    return (
        <main className="container mx-auto px-6 py-10">

            <SearchBar />
            {
                setupData?.categories &&
                <CategorySlider />
            }

            {/* Products */}
            {loading ? (
                <div className="w-full min-h-screen flex items-center justify-center"><Loader size={30} color="#000" /></div>
            ) : (
                <>
                    <div className="flex justify-start mb-6">
                        <CustomSelect
                            value={sort}
                            options={SORT_OPTIONS}
                            placeholder="ترتيب حسب"
                            onChange={(value) => {
                                setSort(value);

                                // 🔥 مهم: نرجع لأول صفحة
                                setShopPag(prev => ({ ...prev, page: 1 }));

                                // 🔥 نحمّل أول صفحة بالترتيب الجديد
                                loadProducts(1, value);
                            }}
                        />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {
                            products[`${shopPag.page}_${sort || "default"}`]?.length > 0 ?
                                products[`${shopPag.page}_${sort || "default"}`].map((p) => (
                                    <ProductCard
                                        key={p._id}
                                        id={p._id}
                                        title={p.name}
                                        price={p.price}
                                        image={p.images[0].url}
                                        code={p.productNumber}
                                        comparePrice={p.comparePrice}
                                        stock={p.stock}
                                        category={p?.category?.name}
                                        onAdd={() => openCart(p)}
                                    />
                                ))
                                :
                                <div className="w-full min-h-screen h-full col-span-4 flex items-start pt-20 justify-center text-gray-500 text-xl">لا يوجد منتجات حاليا</div>
                        }
                    </div>
                </>
            )}
            {/* Pagination */}
            {shopPag.totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 pt-10 select-none flex-wrap mt-auto mb-0">

                    {/* Previous */}
                    <button
                        disabled={shopPag.page === 1}
                        onClick={() => changePage(shopPag.page - 1)}
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
            ${shopPag.page === p
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
                        disabled={shopPag.page === shopPag.totalPages}
                        onClick={() => changePage(shopPag.page + 1)}
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
