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

  if (setupLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        جاري التحميل...
      </div>
    );
  }
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


  if (!contact) return null;

  return (
    <main
      dir="rtl"
      className="bg-[#f6f6f8] text-[#0d0d1b] min-h-screen px-4 py-12 md:py-24"
    >
      <div className="max-w-5xl mx-auto w-full">

        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 flex items-center justify-center gap-3">
            اتصل بنا <span className="text-2xl md:text-3xl">✦</span>
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            نحن هنا لمساعدتك. لا تتردد في التواصل معنا في أي وقت.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-12 items-start">

          {/* Contact Info */}
          <div className="md:col-span-4 flex flex-col gap-10">

            <Info
              icon={<FaEnvelope />}
              label="راسلنا"
              value={contact.email}
            />

            <Info
              icon={<FaPhoneAlt />}
              label="اتصل بنا"
              value={contact.phone}
              ltr
            />

            {contact.whatsappLink && (
              <a
                href={contact.whatsappLink}
                target="_blank"
                className="block"
              >
                <Info
                  icon={<FaWhatsapp />}
                  label="واتساب"
                  value="تواصل سريع"
                />
              </a>
            )}

            {addressLink && (
              <a href={addressLink} target="_blank">
                <Info
                  icon={<FaMapMarkerAlt />}
                  label="الموقع"
                  value="عرض الخريطة"
                />
              </a>
            )}

            {/* Map preview */}
            <div className="w-full h-48 rounded-2xl overflow-hidden grayscale border border-gray-200">
              <img
                className="w-full h-full object-cover"
                src="/img/location.png"
                alt="location"
              />
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-8 bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm"
          >
            <form onSubmit={handleSendContact} className="flex flex-col gap-8">

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
                <label className="text-sm font-bold pr-1">الرسالة</label>
                <textarea
                  rows={5}
                  placeholder="كيف يمكننا مساعدتك؟"
                  className="w-full border border-black/10 rounded-md p-4 resize-none placeholder:text-gray-300 focus:border-black transition"
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
                  className="bg-linear-to-br from-black to-black/70 text-white px-12 py-3 cursor-pointer rounded-md font-bold flex items-center gap-3 hover:-translate-y-1 transition"
                >
                  {loading ?
                    <span className="w-full h-full flex items-center justify-center"><Loader size={25} color="#fff" /></span>
                    :
                    <>
                      إرسال
                      < FaArrowLeft />
                    </>
                  }
                </button>
              </div>

            </form>
          </motion.div>

        </div>
        <SocialLinks links={social} />
      </div>
    </main>
  );
}

/* UI Components */

function Info({ icon, label, value, ltr }) {
  if (!value) return null;

  return (
    <div className="flex items-center gap-4 group">
      <div className="size-12 rounded-full border border-black flex items-center justify-center group-hover:bg-black group-hover:text-white transition">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium tracking-widest">
          {label}
        </p>
        <p className={`font-medium ${ltr ? "ltr" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function Input({ label, placeholder, type = "text", value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold pr-1">{label}</label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="w-full h-14 border border-black/10 rounded-md px-4 placeholder:text-gray-300 focus:border-black transition"
      />
    </div>
  );
}
