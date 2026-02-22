"use client";

import Loader from "@/Components/Loader";
import { SocialLinks } from "@/Components/SocialLinks";
import { useAuth } from "@/context/AuthContext";
import { sendContact } from "@/lib/api";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaWhatsapp,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function ContactPage() {
  const { setupData, setupLoading } = useAuth();
  const [loading, setLoading] = useState(false)
  const [dataForm, setDataForm] = useState({ name: '', email: '', message: '' })

  const contact = setupData?.config?.contact;
  const addressLink = setupData?.config?.address;
  const social = setupData?.config?.socialMedia;


  const handleSendContact = async (e) => {
    e.preventDefault();

    if (!dataForm.name || !dataForm.email || !dataForm.message) {
      return toast.error("جميع الحقول مطلوبة");
    }

    try {
      setLoading(true);

      const res = await sendContact(dataForm);

      if (res.success) {
        toast.success(res.message);
        setDataForm({ name: "", email: "", message: "" });
      } else {
        toast.error(res.message || "حدث خطأ");
      }

    } catch (err) {
      toast.error("فشل الإرسال");
    } finally {
      setLoading(false);
    }
  };


  if (!contact) return <div className="flex h-screen w-full items-center justify-center text-gray-500 text-xl">
    لا يوجد محتوى متاح
  </div>;

  if (setupLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <Loader size={30} color="#000" />
      </div>
    );
  }
  return (
    <main
      dir="rtl"
      className="relative min-h-screen bg-linear-to-br from-[#f8f8fa] via-white to-[#f2f2f6] text-[#0d0d1b] px-4 py-16 md:py-28 overflow-hidden"
    >
      {/* Background Blur */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-black/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-black/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto w-full">

        {/* Heading */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-linear-to-r from-black to-gray-500 bg-clip-text text-transparent">
            اتصل بنا
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-lg">
            يسعدنا تواصلك معنا في أي وقت. فريقنا جاهز للرد عليك بأسرع وقت ممكن.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-12 items-start">

          {/* Contact Info */}
          <div className="md:col-span-4">

            <div className="bg-white/70 backdrop-blur-xl border border-black/5 rounded-3xl p-8 flex flex-col gap-10 shadow-sm">

              <Info icon={<FaEnvelope />} label="راسلنا" value={contact.email} />

              <Info icon={<FaPhoneAlt />} label="اتصل بنا" value={contact.phone} ltr />

              {contact.whatsappLink && (
                <a href={contact.whatsappLink} target="_blank" className="block">
                  <Info icon={<FaWhatsapp />} label="واتساب" value="تواصل سريع" />
                </a>
              )}

              {addressLink && (
                <a href={addressLink} target="_blank">
                  <Info icon={<FaMapMarkerAlt />} label="الموقع" value="عرض الخريطة" />
                </a>
              )}

              {/* Map */}
              <div className="w-full h-48 rounded-2xl overflow-hidden border border-black/10 group">
                <img
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500"
                  src="/img/location.png"
                  alt="location"
                />
              </div>

            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-8 bg-white p-10 md:p-14 rounded-3xl border border-black/5 shadow-xl"
          >
            <form onSubmit={handleSendContact} className="flex flex-col gap-10">

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="الاسم الكامل"
                  placeholder="أدخل اسمك الكامل"
                  value={dataForm.name}
                  onChange={(e) =>
                    setDataForm({ ...dataForm, name: e.target.value })
                  }
                />

                <Input
                  label="البريد الإلكتروني"
                  placeholder="example@domain.com"
                  type="email"
                  value={dataForm.email}
                  onChange={(e) =>
                    setDataForm({ ...dataForm, email: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold pr-1">
                  الرسالة
                </label>
                <textarea
                  rows={5}
                  placeholder="كيف يمكننا مساعدتك؟"
                  className="w-full border border-black/10 rounded-xl p-4 resize-none placeholder:text-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 transition"
                  value={dataForm.message}
                  onChange={(e) =>
                    setDataForm({ ...dataForm, message: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end">
                <button
                  disabled={loading}
                  type="submit"
                  className="relative cursor-pointer bg-linear-to-br from-black to-black/70 text-white px-14 py-4 rounded-xl font-semibold flex items-center gap-3 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader size={22} color="#fff" />
                  ) : (
                    <>
                      إرسال
                      <FaArrowLeft />
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>

        </div>

        <div className="mt-20">
          <SocialLinks links={social} />
        </div>

      </div>
    </main>
  );
}

/* UI Components */
function Info({ icon, label, value, ltr }) {
  if (!value) return null;

  return (
    <div className="flex items-center gap-4 group">
      <div className="size-12 rounded-full bg-black/5 flex items-center justify-center text-lg group-hover:bg-black group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-semibold tracking-widest">
          {label}
        </p>
        <p className={`font-medium text-gray-700 ${ltr ? "ltr" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
function Input({ label, placeholder, type = "text", value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold pr-1">{label}</label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="w-full h-14 border border-black/10 rounded-xl px-4 placeholder:text-gray-300 focus:border-black focus:ring-2 focus:ring-black/10 transition"
      />
    </div>
  );
}