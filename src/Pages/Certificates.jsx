import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { getStoredCertificates } from "../utils/portfolioStorage";
import Certificate from "../components/Certificate";
import AOS from "aos";
import "aos/dist/aos.css";
import { Award, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({
            once: false,
        });
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);

            if (!supabase) {
                setCertificates(getStoredCertificates());
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("certificates")
                .select("*")
                .order('id', { ascending: true });

            if (error) throw error;

            if (data && data.length > 0) {
                setCertificates(data);
                localStorage.setItem("certificates", JSON.stringify(data));
            } else {
                setCertificates(getStoredCertificates());
            }
        } catch (error) {
            console.warn("Error fetching certificates from Supabase:", error);
            setCertificates(getStoredCertificates());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();

        window.addEventListener('portfolio_certificates_updated', fetchCertificates);
        return () => {
            window.removeEventListener('portfolio_certificates_updated', fetchCertificates);
        };
    }, []);

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16 px-[5%] sm:px-[5%] lg:px-[10%]">
            {/* Header Section */}
            <div className="text-center mb-12" data-aos="fade-up" data-aos-duration="1000">
                <div className="inline-block relative">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400" style={{ fontFamily: "'Space Grotesk', 'Poppins', sans-serif" }}>
                        Certifications & Achievements
                    </h2>
                </div>
                <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base mt-2 font-light">
                    A collection of professional certifications and achievements that validate my expertise
                    and commitment to continuous learning in technology and development.
                </p>
            </div>

            {/* Stats Section */}
            {!loading && certificates.length > 0 && (
                <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12"
                    data-aos="fade-up"
                    data-aos-duration="800"
                >
                    <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
                        <div className="flex items-center justify-center mb-3">
                            <Award className="w-7 h-7 text-zinc-300" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1 font-mono">{certificates.length}</h3>
                        <p className="text-zinc-400 text-xs uppercase tracking-wider">Total Certificates</p>
                    </div>

                    <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
                        <div className="flex items-center justify-center mb-3">
                            <TrendingUp className="w-7 h-7 text-zinc-300" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1 font-mono">
                            {new Date().getFullYear()}
                        </h3>
                        <p className="text-zinc-400 text-xs uppercase tracking-wider">Latest Achievement</p>
                    </div>

                    <div className="bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
                        <div className="flex items-center justify-center mb-3">
                            <CheckCircle className="w-7 h-7 text-emerald-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1 font-mono">100%</h3>
                        <p className="text-zinc-400 text-xs uppercase tracking-wider">Verified Credential</p>
                    </div>
                </div>
            )}

            {/* Certificates Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-zinc-400 text-sm">Loading certificates...</p>
                    </div>
                </div>
            ) : certificates.length === 0 ? (
                <div className="text-center py-20">
                    <Award className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                    <p className="text-zinc-400 text-base">No certificates available yet</p>
                    <p className="text-zinc-500 text-xs mt-1">Check back soon for updates!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate, index) => (
                        <div
                            key={certificate.id || index}
                            data-aos="fade-up"
                            data-aos-duration="800"
                            data-aos-delay={index * 100}
                        >
                            <Certificate
                                ImgSertif={certificate.Img}
                                title={certificate.title}
                                issuer={certificate.issuer}
                                date={certificate.date}
                                description={certificate.description}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Call to Action */}
            {!loading && certificates.length > 0 && (
                <div
                    className="mt-16 text-center"
                    data-aos="fade-up"
                    data-aos-duration="1000"
                >
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', 'Poppins', sans-serif" }}>
                            Continuous Learning Journey
                        </h3>
                        <p className="text-zinc-400 max-w-xl mx-auto mb-6 text-sm leading-relaxed font-light">
                            These certifications represent my dedication to staying current with industry
                            best practices and emerging technologies. I'm always pursuing new knowledge
                            to deliver better solutions.
                        </p>
                        <a
                            href="#Contact"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(255,255,255,0.15)] text-sm"
                        >
                            <span>Let's Work Together</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificates;
