"use client";
import { FaSearch } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { suggestProducts } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const controllerRef = useRef(null);
    const debounceRef = useRef(null);

    // 🔹 debounce search
    useEffect(() => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
            try {
                if (controllerRef.current) controllerRef.current.abort();

                controllerRef.current = new AbortController();
                setLoading(true);

                const res = await suggestProducts(query, controllerRef.current.signal);
                setSuggestions(res.data);

            } catch (err) {
                if (err.name !== "CanceledError") console.log(err);
            } finally {
                setLoading(false);
            }
        }, 400);

    }, [query]);

    const submitSearch = () => {
        if (!query.trim()) return;
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setSuggestions([]);
    };

    return (
        <div className="max-w-full w-2xl mx-auto mb-12 relative">
            <div className="flex items-center">
                <div className="flex w-full relative">
                    <div className="pr-4 text-gray-400 absolute top-[50%] -translate-y-[50%]">
                        <FaSearch />
                    </div>

                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                        className="h-12 w-full outline-none text-right px-3 pr-10 border shadow-sm bg-white border-gray-200 rounded-br-lg rounded-tr-lg"
                        placeholder="ابحث عن المنتجات، الماركات وأكثر..."
                    />
                </div>

                <button
                    onClick={submitSearch}
                    className="black-gradient h-12 px-5  rounded-bl-lg rounded-tl-lg text-white font-semibold transition shadow-sm cursor-pointer hover:-translate-y-1 duration-300"
                >
                    بحث
                </button>
            </div>

            {/* 🔽 Suggestions */}
            {suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {suggestions.map((p) => (
                        <div
                            key={p._id}
                            onClick={() => router.push(`/product/${p._id}`)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                        >
                            <img src={p.images?.[0]?.url} className="size-12 object-contain" />
                            <div className="text-right flex-1">
                                <p className="font-semibold line-clamp-1">{p.name}</p>
                                <p className="text-sm text-gray-500">{p.price} ر.س</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
