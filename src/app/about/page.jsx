"use client";

import { useAuth } from "@/context/AuthContext";

export default function AboutPage() {
    const { setupData } = useAuth();

    const content = setupData?.content;
    
    if (!content) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl text-black/50">لا يوجد محتوى متاح</p>
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
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
            <main className="flex-1">

                {/* About Us */}
                <section className="pt-24 pb-20 px-6 lg:px-12 max-w-[1000px] mx-auto text-center">
                    <div className="flex flex-col items-center mb-16">

                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-[0.05em] mb-12 bg-gradient-to-b from-black to-gray-600 bg-clip-text text-transparent">
                            {aboutUs?.title}
                        </h1>

                        <p className="text-2xl md:text-3xl text-black/80 font-light leading-relaxed mb-10 max-w-4xl">
                            {aboutUs?.description}
                        </p>

                        {aboutUs?.secondaryDescription && (
                            <p className="text-lg text-black/50 font-light leading-relaxed max-w-2xl">
                                {aboutUs.secondaryDescription}
                            </p>
                        )}
                    </div>

                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-black/10 to-transparent mt-20" />
                </section>

                {/* Vision */}
                <section className="py-20 px-6 lg:px-12 max-w-[900px] mx-auto text-center">

                    <h3 className="text-4xl md:text-5xl font-extrabold tracking-[0.05em] mb-12">
                        {vision?.title}
                    </h3>

                    <p className="text-2xl md:text-4xl text-black/70 font-light leading-[1.6] italic">
                        "{vision?.description}"
                    </p>

                    <div className="mt-16 flex justify-center">
                        <div className="h-24 w-[1px] bg-gradient-to-b from-black/20 to-transparent" />
                    </div>
                </section>

                {/* Mission */}
                <section className="py-20 px-6 lg:px-12 max-w-[900px] mx-auto text-center">

                    <h3 className="text-4xl md:text-5xl font-extrabold tracking-[0.05em] mb-12">
                        {mission?.title}
                    </h3>

                    <p className="text-2xl md:text-4xl text-black/70 font-light leading-[1.6]">
                        {mission?.description}
                    </p>

                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-black/10 to-transparent mt-24" />
                </section>

                {/* Terms */}
                {termsOfUse.length > 0 && (
                    <section className="py-24 px-6 lg:px-12 max-w-[900px] mx-auto">
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-[0.05em] text-center mb-20">
                            شروط الاستخدام
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-black/70 font-light leading-relaxed">
                            {termsOfUse.map(term => (
                                <div key={term._id} className="border-r-2 border-black/5 pr-8">
                                    <h4 className="text-xl font-bold text-black mb-4">
                                        {term.title}
                                    </h4>
                                    <p>{term.description}</p>
                                </div>
                            ))}
                        </div>

                        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-black/10 to-transparent mt-24" />
                    </section>
                )}

                {/* Privacy */}
                {privacyPolicy.length > 0 && (
                    <section className="py-24 px-6 lg:px-12 bg-black text-white">
                        <div className="max-w-[900px] mx-auto">

                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-[0.05em] text-center mb-20">
                                سياسة الخصوصية
                            </h2>

                            <div className="space-y-16 text-white/70 font-light leading-relaxed">
                                {privacyPolicy.map(policy => (
                                    <div key={policy._id} className="flex flex-col md:flex-row gap-8 md:gap-16">
                                        <div className="md:w-1/3">
                                            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-4">
                                                <span className="w-8 h-[1px] bg-white/30" />
                                                {policy.title}
                                            </h4>
                                        </div>

                                        <div className="md:w-2/3">
                                            <p>{policy.description}</p>
                                        </div>
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
