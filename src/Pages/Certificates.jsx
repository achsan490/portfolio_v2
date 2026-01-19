import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import Certificate from "../components/Certificate";
import AOS from "aos";
import "aos/dist/aos.css";
import { Award, TrendingUp } from "lucide-react";

const Certificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({
            once: false,
        });
    }, []);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);

            // Check if Supabase is configured
            if (!supabase) {
                console.warn("⚠️ Supabase not configured. Using cached data.");
                const cached = localStorage.getItem('certificates');
                if (cached) {
                    setCertificates(JSON.parse(cached));
                }
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("certificates")
                .select("*")
                .order('id', { ascending: true });

            if (error) throw error;

            setCertificates(data || []);
            if (data && data.length > 0) {
                localStorage.setItem("certificates", JSON.stringify(data));
            }
        } catch (error) {
            console.error("Error fetching certificates:", error);
            // Fallback to cached data
            const cached = localStorage.getItem('certificates');
            if (cached) {
                setCertificates(JSON.parse(cached));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="md:px-[10%] px-[5%] w-full py-20 overflow-hidden" id="Certificates">
            {/* Header Section */}
            <div className="text-center pb-12" data-aos="fade-up" data-aos-duration="1000">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Award className="w-10 h-10 text-blue-500" />
                    <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">
                        <span
                            style={{
                                color: "#2563eb",
                                backgroundImage: "linear-gradient(45deg, #2563eb 10%, #3b82f6 93%)",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Certifications & Achievements
                        </span>
                    </h2>
                </div>
                <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
                    A collection of professional certifications and achievements that validate my expertise
                    and commitment to continuous learning in technology and development.
                </p>
            </div>

            {/* Stats Section */}
            {!loading && certificates.length > 0 && (
                <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                    data-aos="fade-up"
                    data-aos-duration="800"
                >
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
                        <div className="flex items-center justify-center mb-3">
                            <Award className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">{certificates.length}</h3>
                        <p className="text-gray-400 text-sm">Total Certificates</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
                        <div className="flex items-center justify-center mb-3">
                            <TrendingUp className="w-8 h-8 text-blue-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                            {new Date().getFullYear()}
                        </h3>
                        <p className="text-gray-400 text-sm">Latest Achievement</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all">
                        <div className="flex items-center justify-center mb-3">
                            <svg
                                className="w-8 h-8 text-purple-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">100%</h3>
                        <p className="text-gray-400 text-sm">Verified</p>
                    </div>
                </div>
            )}

            {/* Certificates Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Loading certificates...</p>
                    </div>
                </div>
            ) : certificates.length === 0 ? (
                <div className="text-center py-20">
                    <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No certificates available yet</p>
                    <p className="text-gray-500 text-sm mt-2">Check back soon for updates!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate, index) => (
                        <div
                            key={certificate.id || index}
                            data-aos={
                                index % 3 === 0
                                    ? "fade-up-right"
                                    : index % 3 === 1
                                        ? "fade-up"
                                        : "fade-up-left"
                            }
                            data-aos-duration={
                                index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"
                            }
                            data-aos-delay={index * 100}
                        >
                            <Certificate ImgSertif={certificate.Img} />
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
                    <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-lg">
                        <h3 className="text-2xl font-bold text-white mb-3">
                            Continuous Learning Journey
                        </h3>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-6">
                            These certifications represent my dedication to staying current with industry
                            best practices and emerging technologies. I'm always pursuing new knowledge
                            to deliver better solutions.
                        </p>
                        <a
                            href="#Contact"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
                        >
                            <span>Let's Work Together</span>
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificates;
