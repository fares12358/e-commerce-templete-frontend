"use client";
import { FaSearch } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { suggestProducts } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SearchBar() {
    const { simple } = useAuth();
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [isFocused, setIsFocused] = useState(false);

    const controllerRef = useRef(null);
    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);

    /* 🔹 Debounce Search */
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
                setSuggestions(res?.data || []);

            } catch (err) {
                if (err.name !== "CanceledError") console.log(err);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => {
            clearTimeout(debounceRef.current);
        };

    }, [query]);

    /* 🔹 Close on outside click */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setSuggestions([]);
                setIsFocused(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    /* 🔹 Load history */
    useEffect(() => {
        const saved = localStorage.getItem("search_history");
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    }, []);

    const saveToHistory = (term) => {
        if (!term.trim()) return;

        let updated = [term, ...history.filter(h => h !== term)];
        updated = updated.slice(0, 6);

        setHistory(updated);
        localStorage.setItem("search_history", JSON.stringify(updated));
    };

    const submitSearch = () => {
        if (!query.trim()) return;

        saveToHistory(query);
        router.push(`/search?q=${encodeURIComponent(query)}`);

        setSuggestions([]);
        setIsFocused(false);
    };

    return (
        <div ref={wrapperRef} className="max-w-full w-2xl mx-auto mb-12 relative">

            <div className="flex items-center">
                <div className="flex w-full relative">
                    <div className="pr-4 text-gray-400 absolute top-[50%] -translate-y-[50%]">
                        <FaSearch />
                    </div>

                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                        className="h-14 w-full outline-none text-right px-3 pr-10 border shadow-sm bg-white border-gray-200 rounded-br-lg rounded-tr-lg"
                        placeholder="ابحث عن المنتجات، الماركات وأكثر..."
                    />
                </div>

                <button
                    onClick={submitSearch}
                    className="black-gradient h-14 px-5 rounded-bl-lg rounded-tl-lg text-white font-semibold transition shadow-sm cursor-pointer hover:-translate-y-1 duration-300"
                >
                    بحث
                </button>
            </div>

            {/* 🔽 Loading */}
            {isFocused && loading && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden p-4 text-center">
                    جاري البحث...
                </div>
            )}

            {/* 🔽 No Results */}
            {isFocused && !loading && query.length >= 2 && suggestions.length === 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden p-4 text-center text-gray-500">
                    لا توجد نتائج
                </div>
            )}

            {/* 🔽 Suggestions */}
            {isFocused && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {suggestions.map((p) => (
                        <div
                            key={p._id}
                            onClick={() => {
                                router.push(`/product/${p._id}`);
                                setIsFocused(false);
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                        >
                            <img src={p.images?.[0]?.url} className="size-12 object-contain" />
                            <div className="text-right flex-1">
                                <p className="font-semibold line-clamp-1">{p.name}</p>
                                <p className="text-sm text-gray-500">
                                    {p.price} {simple}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 🔽 History */}
            {isFocused && !loading && query.length === 0 && history.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {history.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {    
                                setQuery(item);
                                submitSearch();
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer"
                        >
                            <div className="text-right flex-1">
                                <p className="font-semibold line-clamp-1">{item}</p>
                            </div>
                        </div>
                    ))}
                    <div
                        onClick={() => {
                            setHistory([]);
                            localStorage.removeItem("search_history");
                        }}
                        className="p-3 text-center text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
                    >
                        مسح السجل
                    </div>
                </div>
            )}

        </div>
    );
}