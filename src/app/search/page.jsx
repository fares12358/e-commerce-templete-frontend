"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchProducts } from "@/lib/api";
import Loader from "@/Components/Loader";
import ProductCard from "@/Components/ProductCard";
import SearchBar from "@/Components/SearchBar";

export default function SearchPage() {

    const params = useSearchParams();
    const q = params.get("q");

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await searchProducts(q, page);
            setProducts(res.data);
            setTotalPages(res.pagination.totalPages);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [q]);

    useEffect(() => {
        if (q) fetchData();
    }, [q, page]);

    if (loading) return <div className="py-40 flex justify-center"><Loader /></div>;

    return (
        <main className="container min-h-screen mx-auto px-4 py-10" dir="rtl">
            <SearchBar />

            <h2 className="text-2xl font-bold mb-8">
                نتائج البحث عن: "{q}"
            </h2>

            {products?.length === 0 ? (
                <p className="text-gray-400 text-center py-20">لا توجد نتائج</p>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products?.map(p => (
                            <ProductCard key={p._id}
                                id={p._id}
                                title={p.name}
                                price={p.price}
                                image={p.images[0].url}
                                code={p.productNumber}
                                comparePrice={p.comparePrice}
                                stock={p.stock}
                                category={p?.categoryId?.name}
                            // onAdd={() => openCart(p)}
                            />
                        ))}
                    </div>

                    {/* pagination */}
                    <div className="flex justify-center gap-2 mt-10">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`px-4 py-2 rounded ${page === i + 1 ? "bg-black text-white" : "border"}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </main>
    );
}
