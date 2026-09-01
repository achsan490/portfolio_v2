import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase";
import { getStoredProjects, getStoredCertificates, getStoredTechStack } from "../utils/portfolioStorage";

import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes } from "lucide-react";


const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);


function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      style={{ display: value !== index ? 'none' : 'block' }}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box sx={{ p: { xs: 1, sm: 3 } }}>
        <Typography component="div">{children}</Typography>
      </Box>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// techStacks tetap sama (fallback jika belum ada data dari Supabase)
const defaultTechStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
  { icon: "canva.svg", language: "Canva" },
  { icon: "adobe-animate.svg", language: "Adobe Animate" },
  { icon: "photoshop.svg", language: "Adobe Photoshop" },
  { icon: "capcut.svg", language: "Capcut" },
  { icon: "figma.svg", language: "Figma" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [techStacks, setTechStacks] = useState(defaultTechStacks);
  const [techStackLoading, setTechStackLoading] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Project');
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  // Refresh AOS when projects change
  useEffect(() => {
    if (projects.length > 0) {
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  }, [projects, selectedCategory, showAllProjects]);


  const normalizeTechStack = (items) => {
    return (items || [])
      .filter((item) => item?.name && item?.icon_url)
      .sort((a, b) => {
        const orderA = a.sort_order ?? 0;
        const orderB = b.sort_order ?? 0;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      })
      .map((item) => ({
        icon: item.icon_url,
        language: item.name
      }));
  };

  // Data Project Default jika Supabase tidak dikonfigurasi
  const defaultProjects = [
    // --- PROJECTS ---
    {
      id: 26,
      Title: "TypeCraft Pro",
      Description: "TypeCraft Pro — Minimalist Typing Test & Arcade Defense. Platform tes kecepatan mengetik profesional dengan analitik WPM presisi, sound effect keyboard mekanik, real-time feedback, dan mode arcade Word Defense.",
      Link: "https://ayo-mengetik.vercel.app/",
      Img: "/typecraft-preview.png",
      category: "Project"
    },
    {
      id: 25,
      Title: "AI Idea Roulette",
      Description: "AI Idea Roulette — Engineering Spec Generator & Project Brief Generator. Platform web interaktif untuk menghasilkan konsep proyek web, arsitektur tech stack, strategi monetisasi, dan viral growth thesis secara instan.",
      Link: "https://idea-slot.vercel.app/",
      Img: "/idea-slot-preview.png",
      category: "Project"
    },
    {
      id: 24,
      Title: "UNWAHA Official Redesign",
      Description: "Website Profile Kampus Modern Universitas KH. A. Wahab Hasbullah (UNWAHA) Tambakberas Jombang - Global Islamic University. Terintegrasi portal PMB 2026, SIAKAD, katalog prodi, beasiswa santri, dan dark mode.",
      Link: "https://unwaha.com/",
      Img: "/unwaha-preview.png",
      category: "Project"
    },
    {
      id: 23,
      Title: "KKN 27 Desa Klitih",
      Description: "Website Profile Cinematic Interaktif KKN Tematik 2026 Kelompok 27 Desa Klitih, Kecamatan Plandaan, Kabupaten Jombang - Universitas KH. A. Wahab Hasbullah (UNWAHA).",
      Link: "https://kkn27.vercel.app/",
      Img: "/kkn27-preview.png",
      category: "Project"
    },
    {
      id: 22,
      Title: "SIPAS Desa Klitih",
      Description: "Sistem Informasi Pelayanan Administrasi Surat (SIPAS) Desa Klitih. Layanan pengajuan surat keterangan desa secara online 24 jam yang cepat, transparan, dan terverifikasi.",
      Link: "https://surat-desa-klitih.vercel.app/",
      Img: "/sipas-preview.png",
      category: "Project"
    },
    {
      id: 21,
      Title: "PayCalc - Win95 Edition",
      Description: "PayCalc v1.0 Windows 95 Desktop Edition - Aplikasi kalkulator unik bertema retro Windows 95 dengan fitur paywall interaktif dan efek suara khas.",
      Link: "https://klktr.vercel.app/",
      Img: "/paycalc-win95-preview.png",
      category: "Project"
    },
    {
      id: 20,
      Title: "BEM FAI UNWAHA 2026",
      Description: "Website resmi Badan Eksekutif Mahasiswa Fakultas Agama Islam Universitas KH. A. Wahab Hasbullah (UNWAHA) Jombang - Kabinet Perunggu 2026.",
      Link: "https://bem-fai.vercel.app/",
      Img: "/bem-fai-preview.png",
      category: "Project"
    },
    {
      id: 19,
      Title: "Web Desa Pojok Klitih",
      Description: "Website resmi Desa Pojok Klitih, Kecamatan Plandaan, Kabupaten Jombang. Dilengkapi fitur berita desa, agenda kegiatan, galeri, layanan surat online, data desa, dan informasi potensi desa.",
      Link: "https://desapojokklitih.vercel.app/",
      Img: "/web-desa-sukamaju.png",
      category: "Project"
    },
    {
      id: 18,
      Title: "LaporApp KKN",
      Description: "A web-based helper application for KKN and volunteer students to generate individual reports and export them to PDF and Microsoft Word format.",
      Link: "https://laporan-individu.vercel.app/",
      Img: "/laporan-individu.png",
      category: "Project"
    },
    {
      id: 17,
      Title: "Caffè POS",
      Description: "Caffè POS is a modern, feature-rich Point of Sale (POS) system designed for cafes, featuring receipt generation, sales dashboard, product management, and real-time transaction reports.",
      Link: "https://kasir-cafe-modern.vercel.app/",
      Img: "/caffe-pos.png",
      category: "Project"
    },
    {
      id: 16,
      Title: "Rizmahira Shop",
      Description: "Rizmahira Shop is a trusted online store featuring selected products across categories like food, accessories, fashion, and beauty, with easy WhatsApp checkout integration.",
      Link: "https://rizmahira.vercel.app/",
      Img: "/rizmahira.png",
      category: "Project"
    },
    {
      id: 15,
      Title: "YXGClip",
      Description: "A Streamlit web application designed to trim, extract, and download highlights and short clips from YouTube videos.",
      Link: "https://yxgclip.streamlit.app/",
      Img: "/yxgclip.png",
      category: "Project"
    },
    {
      id: 14,
      Title: "AI Hunter",
      Description: "AI Hunter is a curated directory platform for discovering top-tier AI tools. It features advanced filtering, tool categories, and detailed insights to help users find the perfect AI solution.",
      Link: "https://ai-hunter-seven.vercel.app/",
      Img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
      category: "Project"
    },
    {
      id: 13,
      Title: "CineStream",
      Description: "A modern movie streaming platform with a vast library of films, featuring a sleek user interface and seamless viewing experience.",
      Link: "https://movie-gules-nine.vercel.app/",
      Img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
      category: "Project"
    },
    {
      id: 1,
      Title: "Reward System",
      Description: "A gamified reward platform featuring point tracking, redemption system, and intuitive user dashboard.",
      Link: "https://reward-system-two.vercel.app/",
      Img: "/reward-system.png",
      category: "Project"
    },
    {
      id: 2,
      Title: "BEM UNWAHA 2025",
      Description: "Official website for the Student Executive Board (BEM) of UNWAHA 2025. A central hub for student news, organizational updates, and event management.",
      Link: "https://bem-u.vercel.app/",
      Img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop",
      category: "Project"
    },
    {
      id: 3,
      Title: "Sabana POS",
      Description: "Comprehensive Point of Sale application integrated with inventory management and sales analytics.",
      Link: "https://sabana-pos.vercel.app/",
      Img: "/sabana-pos.png",
      category: "Project"
    },
    {
      id: 4,
      Title: "MerahPutih Premium Store",
      Description: "A full-stack e-commerce solution featuring a powerful admin control panel and a responsive mobile shopping interface.",
      Link: "https://merahputihpremium.free.je/admin/index.php",
      Img: "/merahputihstore.png",
      category: "Project"
    },

    // --- DESIGNS ---
    {
      id: 5,
      Title: "Nexus Mobile App",
      Description: "Sleek mobile application UI/UX design focusing on minimalism and user engagement.",
      Link: "#",
      Img: "/mobile-app.png",
      category: "Design"
    },
    {
      id: 6,
      Title: "EduPath Dashboard",
      Description: "Interactive learning management system dashboard designed for optimal student progress tracking.",
      Link: "#",
      Img: "/elearning.png",
      category: "Design"
    },
    {
      id: 7,
      Title: "North Atlantic Brand",
      Description: "Complete corporate brand identity system including logo, stationery, and brand guidelines.",
      Link: "#",
      Img: "/brand-identity.png",
      category: "Design"
    },
    {
      id: 8,
      Title: "Growth Marketing Kit",
      Description: "Cohesive social media template collection designed for high-conversion digital marketing campaigns.",
      Link: "#",
      Img: "/social-media.png",
      category: "Design"
    },

    // --- EDITING ---
    {
      id: 9,
      Title: "Japan Cinematic Vlog",
      Description: "4K travel cinematic montage capturing the essence of Japan through advanced color grading and sound design.",
      Link: "#",
      Img: "/travel-vlog.png",
      category: "Editing"
    },
    {
      id: 10,
      Title: "Tech Review 2026",
      Description: "High-energy tech gadget review featuring dynamic b-roll, text overlays, and engaging pacing.",
      Link: "#",
      Img: "/tech-review.png",
      category: "Editing"
    },
    {
      id: 11,
      Title: "Corporate Vision",
      Description: "Professional promotional video highlighting company values with clean motion graphics.",
      Link: "#",
      Img: "/corporate-promo.png",
      category: "Editing"
    },
    {
      id: 12,
      Title: "Urban Energy",
      Description: "Fast-paced short-form content optimized for TikTok and Reels with trendy visual effects.",
      Link: "#",
      Img: "/short-form.png",
      category: "Editing"
    }
  ];

  const defaultCertificates = [
    {
      id: 1,
      Img: "/certificates/sql-certificate.jpg",
      title: "Introduction to SQL",
      issuer: "Sololearn",
      date: "April 21, 2025",
      description: "Successfully completed the course by demonstrating theoretical and practical understanding of SQL fundamentals, including database queries, data manipulation, and relational database concepts."
    },
    {
      id: 2,
      Img: "/certificates/python-essentials.jpg",
      title: "Python Essentials 1",
      issuer: "Cisco Networking Academy & Python Institute",
      date: "June 07, 2026",
      description: "Successfully completed the Python Essentials 1 course, demonstrating a foundational understanding of Python programming concepts including syntax, data types, control flow, functions, and basic algorithms."
    },
    {
      id: 3,
      Img: "/certificates/javascript-essentials.jpg",
      title: "JavaScript Essentials 1",
      issuer: "Cisco Networking Academy & JS Institute",
      date: "June 04, 2026",
      description: "Successfully completed the JavaScript Essentials 1 course, establishing a robust foundation in JavaScript core programming concepts, control structures, operations, and basic scripting."
    },
    {
      id: 4,
      Img: "/certificates/youtube-music.jpg",
      title: "Sertifikasi YouTube Music",
      issuer: "YouTube Music",
      date: "June 04, 2026",
      description: "Certified in YouTube Music Channel Management, demonstrating proficiency in managing official artist channels, audience growth strategies, and content optimization techniques."
    },
    {
      id: 5,
      Img: "/certificates/financial-literacy.jpg",
      title: "Introduction to Financial Literacy",
      issuer: "Dicoding Academy",
      date: "June 04, 2026",
      description: "Successfully completed the Introduction to Financial Literacy course, demonstrating core competencies in basic financial planning, budgeting, investment principles, and wealth management."
    },
    {
      id: 6,
      Img: "/certificates/javascript-statement.jpg",
      title: "Statement of Achievement - JavaScript Essentials 1",
      issuer: "Cisco Networking Academy & JS Institute",
      date: "June 04, 2026",
      description: "Awarded student level credential for proficiently demonstrating understanding of variables, data types, program flow, loops, functions, and exceptions in JavaScript."
    }
  ];

  const fetchData = useCallback(async () => {
    // If Supabase is not configured, load from reliable localStorage storage
    if (!supabase) {
      setProjects(getStoredProjects());
      setCertificates(getStoredCertificates());
      setTechStacks(getStoredTechStack());
      setTechStackLoading(false);
      return;
    }

    try {
      setTechStackLoading(true);
      const [projectsResponse, certificatesResponse, techStackResponse] = await Promise.all([
        supabase.from("projects").select("*").order('id', { ascending: true }),
        supabase.from("certificates").select("*").order('id', { ascending: true }),
        supabase.from("tech_stack").select("*").order('sort_order', { ascending: true }),
      ]);

      const projectData = projectsResponse.data || [];
      const certificateData = certificatesResponse.data || [];
      const techStackData = techStackResponse?.data || [];

      if (!projectsResponse.error && projectData.length > 0) {
        setProjects(projectData);
        localStorage.setItem("projects", JSON.stringify(projectData));
      } else {
        setProjects(getStoredProjects());
      }

      if (!certificatesResponse.error && certificateData.length > 0) {
        setCertificates(certificateData);
        localStorage.setItem("certificates", JSON.stringify(certificateData));
      } else {
        setCertificates(getStoredCertificates());
      }

      if (!techStackResponse.error && techStackData.length > 0) {
        const normalizedTechStack = normalizeTechStack(techStackData);
        setTechStacks(normalizedTechStack);
        localStorage.setItem("tech_stack", JSON.stringify(normalizedTechStack));
      } else {
        setTechStacks(getStoredTechStack());
      }
    } catch (error) {
      console.warn("Supabase fetch failed, fallback to localStorage:", error.message);
      setProjects(getStoredProjects());
      setCertificates(getStoredCertificates());
      setTechStacks(getStoredTechStack());
    } finally {
      setTechStackLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    window.addEventListener('portfolio_projects_updated', fetchData);
    window.addEventListener('portfolio_certificates_updated', fetchData);
    window.addEventListener('portfolio_techstack_updated', fetchData);

    return () => {
      window.removeEventListener('portfolio_projects_updated', fetchData);
      window.removeEventListener('portfolio_certificates_updated', fetchData);
      window.removeEventListener('portfolio_techstack_updated', fetchData);
    };
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  }, []);

  // Filter projects berdasarkan kategori yang dipilih
  const filteredProjects = projects.filter(project => {
    const projectCategory = project.category || 'Project'; // Default ke 'Project' jika tidak ada category
    return projectCategory === selectedCategory;
  });

  const displayedProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] overflow-hidden" id="Portofolio">
      {/* Header section */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">
          <span style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #d4d4d8 50%, #a1a1aa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Space Grotesk', 'Poppins', sans-serif"
          }}>
            Portfolio Showcase
          </span>
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base mt-2 font-light">
          Explore my journey through projects, certifications, and technical expertise.
          Each section represents a milestone in my continuous learning path.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.02)",
              backdropFilter: "blur(12px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "64px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.85rem", md: "0.95rem" },
                fontWeight: "500",
                color: "#a1a1aa",
                textTransform: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "16px 0",
                zIndex: 1,
                margin: "6px",
                borderRadius: "14px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  transform: "translateY(-1px)",
                },
                "&.Mui-selected": {
                  color: "#000000",
                  backgroundColor: "#ffffff",
                  fontWeight: "600",
                  boxShadow: "0 4px 20px rgba(255, 255, 255, 0.15)",
                  "& .lucide": {
                    color: "#000000",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "6px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-1.5 w-4 h-4 transition-all duration-300" />}
              label="Projects"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-1.5 w-4 h-4 transition-all duration-300" />}
              label="Certificates"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-1.5 w-4 h-4 transition-all duration-300" />}
              label="Tech Stack"
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            {/* Category Filter */}
            <div className="mb-8 flex justify-center overflow-x-auto px-4 sm:px-0" data-aos="fade-down" data-aos-duration="800">
              <div className="inline-flex bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 gap-1.5 min-w-max">
                {['Project', 'Design', 'Editing'].map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowAllProjects(false);
                    }}
                    className={`
                      px-5 sm:px-7 py-2 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 whitespace-nowrap
                      ${selectedCategory === category
                        ? 'bg-white text-black shadow-md shadow-white/10 font-semibold'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="container mx-auto py-8 min-h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.length === 0 && projects.length > 0 && (
                  <div className="col-span-full text-center py-20">
                    <p className="text-gray-400 text-lg">No projects found in this category</p>
                  </div>
                )}
                {displayedProjects.length === 0 && projects.length === 0 && (
                  <div className="col-span-full text-center py-20">
                    <p className="text-gray-400 text-lg">Loading projects...</p>
                  </div>
                )}
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay={index * 100}
                  >
                    <CardProject
                      Img={project.Img}
                      Title={project.Title}
                      Description={project.Description}
                      Link={project.Link}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {filteredProjects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={certificate.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
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
            </div>
            {certificates.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('certificates')}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStackLoading && techStacks.length === 0 && (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-400 text-lg">Loading tech stack...</p>
                  </div>
                )}
                {!techStackLoading && techStacks.length === 0 && (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-400 text-lg">No tech stack items yet</p>
                  </div>
                )}
                {techStacks.map((stack, index) => (
                  <div
                    key={`${stack.language}-${index}`}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}
