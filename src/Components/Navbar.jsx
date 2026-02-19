"use client";
import Link from "next/link";
import { useState } from "react";
import { FaShoppingCart, FaUser, FaBars, FaShoppingBag, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/lib/api";
import Loader from "./Loader";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

export default function Navbar() {
  const { user, setUser, isAuth, setIsAuth, cart } = useAuth();
  const pathname = usePathname();
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [viewConfirm, setViewConfirm] = useState(false)

  const logout = async () => {
    if (logoutLoading) return;
    try {
      setLogoutLoading(true);

      const res = await logoutUser(); // 👈 مهم جداً

      if (res?.success) {
        toast.success("تم تسجيل الخروج");
        setUser(null);
        setIsAuth(false);
      } else {
        toast.error(res?.message || "لم يتم تسجيل الخروج");
      }

    } catch (error) {
      toast.error(
        error?.message ||
        error?.response?.data?.message ||
        "فشل الاتصال بالسيرفر"
      );
    } finally {
      setLogoutLoading(false);
      setViewConfirm(false)
      setShowMenu(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div
        className="max-w-300 mx-auto px-4 md:px-10 py-4 flex items-center justify-between"
        dir="rtl"
      >

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { router.push('/') }}>
          <FaShoppingBag size={20} />
          <span className="font-bold text-xl">متجرك</span>
        </div>

        <div className="hidden md:flex gap-10 text-sm font-semibold">

          <Link
            href="/"
            className={`pb-1 transition ${pathname === "/"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-500 hover:text-black"
              }`}
          >
            الرئيسية
          </Link>

          <Link
            href="/shop"
            className={`pb-1 transition ${pathname === "/shop"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-500 hover:text-black"
              }`}
          >
            المتجر
          </Link>

          <Link
            href="/about"
            className={`pb-1 transition ${pathname === "/about"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-500 hover:text-black"
              }`}
          >
            من نحن
          </Link>
          <Link
            href="/contact"
            className={`pb-1 transition ${pathname === "/contact"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-500 hover:text-black"
              }`}
          >
            تواصل معنا
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {
              user &&
              <>
                <button className="relative p-2 rounded-full hover:bg-gray-100 group cursor-pointer" onClick={() => { setShowMenu(false); if (user) { router.push('/cart') } else { toast.error('سجل الدخول لفتح الصفحة') } }}>
                  <FaShoppingCart className={`group-hover:text-blue-400  transition-all duration-300 ease-in-out ${pathname === "/cart" ? "text-blue-400" : "text-gray-400"
                    }`} />
                  {
                    cart.length > 0 && (
                      <span className="absolute -top-1 -left-1 bg-blue-400 text-white text-[10px] min-w-4 w-4 h-4 p-1 rounded-sm flex items-center justify-center">
                        {cart.length}
                      </span>
                    )
                  }
                </button>

                <button className="p-2 rounded-full hover:bg-gray-100 group cursor-pointer" onClick={() => { setShowMenu(false); if (user) { router.push('/account') } else { toast.error('سجل الدخول لفتح الصفحة') } }}>
                  <FaUser className={`group-hover:text-blue-400 transition-all duration-300 ease-in-out ${pathname === "/account" ? "text-blue-400" : "text-gray-400"}`} />
                </button>
              </>
            }
            {!user &&
              <Link href={'/auth/login'} onClick={() => setShowMenu(false)} className="py-3 ml-2 px-4 bg-linear-to-br text-xs md:hidden from-blue-600 to-blue-400 text-white rounded-sm shadow-sm cursor-pointer">تسجيل الدخول</Link>
            }
            {/* Mobile menu button */}
            <button
              onClick={() => { setShowMenu(!showMenu) }}
              className="md:hidden p-3 rounded-md hover:bg-gray-100 bg-linear-to-br from-black to-black/70 text-white"
            >
              {
                showMenu ?
                  <FaTimes />
                  :
                  <FaBars />
              }
            </button>
          </div>
          {
            !user ? (
              <Link href={'/auth/login'} className="py-2 px-6 bg-linear-to-br from-blue-600 to-blue-400 text-white font-semibold rounded-md shadow-sm hidden md:block cursor-pointer">تسجيل الدخول</Link>
            ) : (
              <button
                onClick={() => { setViewConfirm(true) }}
                type="button"
                disabled={logoutLoading}
                className="py-2 px-6 bg-linear-to-br from-red-600 to-red-400 text-white font-semibold rounded-md shadow-sm hidden md:block cursor-pointer">
                {
                  logoutLoading ?
                    <span><Loader size={20} color="#fff" /></span>
                    :
                    "تسجيل الخروج"
                }
              </button>
            )
          }
        </div>

      </div>

      {/* Mobile simple menu (not drawer) */}
      {showMenu && (
        <div className="md:hidden border-b border-gray-200 bg-white/80 backdrop-blur-md px-6 py-6 space-y-6 text-sm font-medium" dir="rtl">
          <Link
            href="/"
            onClick={() => setShowMenu(false)}
            className={`block font-semibold ${pathname === "/" ? "text-blue-400" : "text-dark"
              }`}
          >
            الرئيسية
          </Link>

          <Link
            href="/shop"
            onClick={() => setShowMenu(false)}
            className={`block font-semibold ${pathname === "/shop" ? "text-blue-400" : "text-dark"
              }`}
          >
            المتجر
          </Link>

          <Link
            href="/about"
            onClick={() => setShowMenu(false)}
            className={`block font-semibold ${pathname === "/about" ? "text-blue-400" : "text-dark"
              }`}
          >
            من نحن
          </Link>
          <Link
            href="/contact"
            onClick={() => setShowMenu(false)}
            className={`block font-semibold ${pathname === "/contact" ? "text-blue-400" : "text-dark"
              }`}
          >
            تواصل معنا
          </Link>
          {
            user &&
            <button
              onClick={() => setViewConfirm(true)}
              type="button"
              disabled={logoutLoading}
              className="py-2 px-6 bg-linear-to-br from-red-600 to-red-400 text-white rounded-md shadow-sm cursor-pointer">
              {
                logoutLoading ?
                  <span><Loader size={20} color="#fff" /></span>
                  :
                  "تسجيل الخروج"
              }
            </button>
          }
        </div>
      )}
      <ConfirmModal
        open={viewConfirm}
        title={"تسجيل الخروج"}
        message={"هل انت متاكد انك تريد تسجيل الخروج؟"}
        onConfirm={logout}
        icon={<FaSignOutAlt size={40} />}
        loading={logoutLoading}
        onCancel={() => setViewConfirm(false)} />
    </header>
  );
}
