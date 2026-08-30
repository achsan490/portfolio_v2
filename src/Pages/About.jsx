import React, { useEffect, memo, useMemo, useState } from "react"
import { FileText, Code, Award, Globe, ArrowUpRight, UserCheck } from "lucide-react"
import { supabase } from "../supabase"
import { getStoredProfile, getStoredProjects, getStoredCertificates } from "../utils/portfolioStorage"
import Badge3D from "../components/Badge3D"
import AOS from 'aos'
import 'aos/dist/aos.css'

// Memoized Components
const Header = memo(() => (
  <div className="text-center lg:mb-8 mb-2 px-[5%]">
    <div className="inline-block relative group">
      <h2
        className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400"
        data-aos="zoom-in-up"
        data-aos-duration="600"
        style={{ fontFamily: "'Space Grotesk', 'Poppins', sans-serif" }}
      >
        About Me
      </h2>
    </div>
    <p
      className="mt-2 text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base font-light tracking-wide"
      data-aos="zoom-in-up"
      data-aos-duration="800"
    >
      "Transforming ideas into digital experiences"
    </p>
  </div>
));

const StatCard = memo(({ icon: Icon, value, label, description, animation }) => (
  <div data-aos={animation} data-aos-duration={1300} className="relative group">
    <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-white/10 to-white/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>
    <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-white/15 via-white/5 to-transparent">
      <div className="relative rounded-3xl bg-[#08080c]/90 border border-white/10 backdrop-blur-xl p-6 overflow-hidden h-full shadow-[0_12px_40px_rgba(0,0,0,0.6)] group-hover:border-white/20 transition-all duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)]"></div>
        <div className="absolute -top-1/2 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 via-transparent to-transparent animate-scanline"></div>
        <div className="absolute top-0 -left-full h-full w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-20 animate-[shine_7s_ease-in-out_infinite]"></div>

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="relative w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 p-[1px] flex items-center justify-center shadow-lg">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-1">
              <p className="text-[0.68rem] uppercase tracking-[0.25em] text-zinc-400 font-medium">{label}</p>
              <p className="text-xs text-zinc-400">{description}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
              {value}
            </span>
            <div className="mt-1 flex items-center justify-end gap-1 text-[0.62rem] text-zinc-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>active</span>
            </div>
          </div>
        </div>

        <div className="relative mt-5 h-[1.5px] rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-white/40 to-transparent animate-statglow"></div>
        </div>

        <div className="absolute right-4 bottom-4 text-zinc-500 transition-colors group-hover:text-white">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  </div>
));

const AboutPage = () => {
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalCertificates, setTotalCertificates] = useState(0);
  const [profileData, setProfileData] = useState({
    name: "M. Achsanul Khuluq Izzulchaq",
    description: "Saya adalah mahasiswa lulusan S1 Teknik Informatika yang siap memulai jenjang karir baru sebagai freshgraduate, sebelumnya saya pernah memiliki pengalaman dalam pengembangan aplikasi web, sistem informasi, serta proyek berbasis Next.js, PHP, dan MySQL. Terlibat dalam pembuatan sistem loyalty reward, website desa, dan aplikasi CRUD akademik. Terbiasa bekerja dengan tampilan modern menggunakan Tailwind CSS serta mampu mengembangkan fitur kompleks seperti komentar, pagination, dan integrasi API. Siap berkontribusi dalam proyek IT dan pengembangan aplikasi.",
    photo_url: "/Photo.jpg",
    cv_link: "/CV_Achsanul_Khuluq.jpg"
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      let data = null;

      if (supabase) {
        try {
          const { data: dbData } = await supabase
            .from('profile_settings')
            .select('name, description, photo_url, cv_link')
            .eq('id', 1)
            .maybeSingle();
          if (dbData) data = dbData;
        } catch (error) {
          console.warn('Error fetching profile settings from Supabase:', error);
        }
      }

      if (!data) {
        data = getStoredProfile();
      }

      if (data) {
        setProfileData({
          name: data.name || "M. Achsanul Khuluq Izzulchaq",
          description: data.description || "Saya adalah mahasiswa lulusan S1 Teknik Informatika...",
          photo_url: data.photo_url || "/Photo.jpg",
          cv_link: data.cv_link || "/CV_Achsanul_Khuluq.jpg"
        });
      }
    };

    fetchProfile();

    window.addEventListener('portfolio_profile_updated', fetchProfile);
    return () => {
      window.removeEventListener('portfolio_profile_updated', fetchProfile);
    };
  }, []);

  // Fetch stats data
  useEffect(() => {
    const fetchStats = async () => {
      let projectsCount = 0;
      let certsCount = 0;

      if (supabase) {
        try {
          const { count: pCount } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true });
          if (pCount !== null && pCount !== undefined) projectsCount = pCount;

          const { count: cCount } = await supabase
            .from('certificates')
            .select('*', { count: 'exact', head: true });
          if (cCount !== null && cCount !== undefined) certsCount = cCount;
        } catch (error) {
          console.warn('Error fetching stats from Supabase:', error);
        }
      }

      if (projectsCount === 0) {
        projectsCount = getStoredProjects().length;
      }
      if (certsCount === 0) {
        certsCount = getStoredCertificates().length;
      }

      setTotalProjects(projectsCount);
      setTotalCertificates(certsCount);
    };

    fetchStats();

    const handleDataUpdate = () => {
      fetchStats();
    };

    window.addEventListener('portfolio_projects_updated', handleDataUpdate);
    window.addEventListener('portfolio_certificates_updated', handleDataUpdate);

    return () => {
      window.removeEventListener('portfolio_projects_updated', handleDataUpdate);
      window.removeEventListener('portfolio_certificates_updated', handleDataUpdate);
    };
  }, []);

  const YearExperience = useMemo(() => {
    return 1;
  }, []);

  const statsData = useMemo(() => [
    {
      icon: Code,
      value: totalProjects,
      label: "Total Projects",
      description: "Innovative web solutions crafted",
      animation: "fade-right",
    },
    {
      icon: Award,
      value: totalCertificates,
      label: "Certificates",
      description: "Professional skills validated",
      animation: "fade-up",
    },
    {
      icon: Globe,
      value: YearExperience,
      label: "Years of Experience",
      description: "Continuous learning journey",
      animation: "fade-left",
    },
  ], [totalProjects, totalCertificates, YearExperience]);

  return (
    <div
      className="h-auto pb-[10%] text-white overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] mt-10 sm:mt-0"
      id="About"
    >
      <Header />

      <div className="w-full mx-auto pt-8 sm:pt-12 relative space-y-12">
        {/* Profile Intro & Bio Section */}
        <div className="max-w-4xl mx-auto space-y-6 text-center" data-aos="fade-up" data-aos-duration="1000">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', 'Poppins', sans-serif" }}>
            <span className="text-zinc-400 font-light mr-3">
              Hello, I'm
            </span>
            <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
              {profileData.name}
            </span>
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed text-center sm:text-justify max-w-3xl mx-auto font-light">
            {profileData.description}
          </p>

          {/* Quote Section */}
          <div
            className="relative max-w-2xl mx-auto bg-white/[0.02] border border-white/10 rounded-2xl p-4 my-6 backdrop-blur-md shadow-2xl overflow-hidden"
            data-aos="fade-up"
            data-aos-duration="1200"
          >
            <div className="absolute top-2 right-4 w-16 h-16 bg-white/[0.03] rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-2 w-12 h-12 bg-white/[0.03] rounded-full blur-lg"></div>

            <div className="absolute top-3 left-4 text-zinc-500 opacity-40">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
              </svg>
            </div>

            <blockquote className="text-zinc-300 text-center italic font-medium text-xs sm:text-sm relative z-10 pl-6">
              "Leveraging AI as a professional tool, not a replacement."
            </blockquote>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a href={profileData.cv_link} className="w-full sm:w-auto">
              <button
                data-aos="fade-up"
                data-aos-duration="800"
                className="w-full sm:w-auto sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white text-black font-semibold transition-all duration-300 hover:bg-zinc-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.15)] text-xs sm:text-sm"
              >
                <FileText className="w-4 h-4" /> Download CV
              </button>
            </a>
            <a href="#Portofolio" className="w-full sm:w-auto">
              <button
                data-aos="fade-up"
                data-aos-duration="1000"
                className="w-full sm:w-auto sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-300 font-medium transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:text-white hover:scale-105 active:scale-95 flex items-center justify-center gap-2 backdrop-blur-md text-xs sm:text-sm"
              >
                <Code className="w-4 h-4" /> View Projects
              </button>
            </a>
          </div>
        </div>

        {/* Full-width Wide 3D Interactive Badge Showcase Box */}
        <div className="w-full mx-auto" data-aos="fade-up" data-aos-duration="1200">
          <Badge3D />
        </div>

        <a href="#Portofolio">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 cursor-pointer">
            {statsData.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </a>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes statglow {
          0% { transform: translateX(-60%); opacity: 0.2; }
          50% { opacity: 0.8; }
          100% { transform: translateX(120%); opacity: 0.2; }
        }
        .animate-statglow {
          animation: statglow 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(AboutPage);
