import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
    return (
        <div className="max-w-full w-2xl mx-auto mb-12 h-fit">
            <div className="flex w-full h-fit items-center gap-2">
                <div className="flex w-full h-fit relative">
                    <div className="pr-4 text-gray-400 absolute top-[50%] -translate-y-[50%]"><FaSearch /></div>
                    <input
                        className="h-11 w-full bg-transparent outline-none text-right px-3 pr-10 focus:outline-none border shadow-sm focus:border-gray-500 border-gray-200 rounded-lg"
                        placeholder="ابحث عن المنتجات، الماركات وأكثر..."
                    />
                </div>

                <button className="black-gradient h-11 px-5 rounded-lg text-white font-semibold transition shadow-sm cursor-pointer hover:-translate-y-1 duration-300 ease-in-out">
                    بحث
                </button>

            </div>
        </div>
    );
}
