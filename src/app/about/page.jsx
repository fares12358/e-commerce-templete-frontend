"use client";

import { useAuth } from "@/context/AuthContext";

export default function AboutPage() {
  const { setupData } = useAuth();
  const content = setupData?.content;

  if (!content) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-xl text-gray-400">لا يوجد محتوى متاح</p>
      </div>
    );
  }

  const {
    aboutUs,
    vision,
    mission,
    termsOfUse = [],
    privacyPolicy = [],
  } = content;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="flex flex-col">

        {/* HERO - About Us */}
        <section className="relative py-24 px-6 lg:px-12 text-center bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-5xl mx-auto">

            <h1 className="text-4xl md:text-6xl font-extrabold mb-10 bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
              {aboutUs?.title}
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8">
              {aboutUs?.description}
            </p>

            {aboutUs?.secondaryDescription && (
              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                {aboutUs.secondaryDescription}
              </p>
            )}
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 px-6 lg:px-12 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

            {/* Vision Card */}
            <div className="p-10 rounded-3xl bg-gray-50 shadow-sm hover:shadow-md transition duration-300">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                {vision?.title}
              </h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed italic">
                "{vision?.description}"
              </p>
            </div>

            {/* Mission Card */}
            <div className="p-10 rounded-3xl bg-gray-50 shadow-sm hover:shadow-md transition duration-300">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                {mission?.title}
              </h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                {mission?.description}
              </p>
            </div>

          </div>
        </section>

        {/* Terms of Use */}
        {termsOfUse.length > 0 && (
          <section className="py-24 px-6 lg:px-12 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
                شروط الاستخدام
              </h2>

              <div className="grid md:grid-cols-2 gap-10">
                {termsOfUse.map((term) => (
                  <div
                    key={term._id}
                    className="p-8 rounded-2xl bg-white shadow-sm hover:shadow-lg transition duration-300"
                  >
                    <h4 className="text-xl font-semibold mb-4">
                      {term.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {term.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Privacy Policy */}
        {privacyPolicy.length > 0 && (
          <section className="py-24 px-6 lg:px-12 bg-black text-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16">
                سياسة الخصوصية
              </h2>

              <div className="space-y-12">
                {privacyPolicy.map((policy) => (
                  <div
                    key={policy._id}
                    className="p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10"
                  >
                    <h4 className="text-xl font-semibold mb-4">
                      {policy.title}
                    </h4>
                    <p className="text-white/70 leading-relaxed">
                      {policy.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}