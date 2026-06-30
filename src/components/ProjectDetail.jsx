import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, ExternalLink, Github, Code2, Star,
  ChevronRight, Layers, Layout, Globe, Package, Cpu, Code, Lock,
} from "lucide-react";
import Swal from 'sweetalert2';

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];

  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
        <span className="text-xs md:text-sm font-medium text-blue-300/90 group-hover:text-blue-200 transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => {
  return (
    <li className="group flex items-start space-x-3 p-2.5 md:p-3.5 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10">
      <div className="relative mt-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
        <div className="relative w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:scale-125 transition-transform duration-300" />
      </div>
      <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition-colors">
        {feature}
      </span>
    </li>
  );
};

const ProjectStats = ({ project }) => {
  const techStackCount = project?.TechStack?.length || 0;
  const featuresCount = project?.Features?.length || 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-[#0a0a1a] rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 opacity-50 blur-2xl z-0" />

      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-blue-500/50 hover:shadow-lg">
        <div className="bg-blue-500/20 p-1.5 md:p-2 rounded-full">
          <Code2 className="text-blue-300 w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-blue-200">{techStackCount}</div>
          <div className="text-[10px] md:text-xs text-gray-400">Total Teknologi</div>
        </div>
      </div>

      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white/5 p-2 md:p-3 rounded-lg border border-cyan-500/20 transition-all duration-300 hover:scale-105 hover:border-cyan-500/50 hover:shadow-lg">
        <div className="bg-cyan-500/20 p-1.5 md:p-2 rounded-full">
          <Layers className="text-cyan-300 w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-cyan-200">{featuresCount}</div>
          <div className="text-[10px] md:text-xs text-gray-400">Fitur Utama</div>
        </div>
      </div>
    </div>
  );
};

const handleGithubClick = (githubLink) => {
  if (githubLink === 'Private') {
    Swal.fire({
      icon: 'info',
      title: 'Source Code Private',
      text: 'Maaf, source code untuk proyek ini bersifat privat.',
      confirmButtonText: 'Mengerti',
      confirmButtonColor: '#3085d6',
      background: '#030014',
      color: '#ffffff'
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // --- FULL DATASET (Matches Portofolio.jsx but with extra details) ---
  const allProjects = [
    // --- PROJECTS ---
    {
      id: 19,
      Title: "Web Desa Pojok Klitih",
      Description: "Website Resmi Desa Pojok Klitih adalah platform digital pemerintah desa yang dibangun menggunakan Next.js untuk menyajikan informasi, layanan, dan potensi Desa Pojok Klitih, Kecamatan Plandaan, Kabupaten Jombang secara modern dan responsif. Platform ini menyediakan berita desa terkini, agenda kegiatan, galeri foto, profil desa, data statistik penduduk, layanan pengajuan surat secara online, serta informasi potensi dan UMKM lokal.",
      Link: "https://desapojokklitih.vercel.app/",
      Github: "https://github.com/achsan490",
      Img: "/web-desa-sukamaju.png",
      category: "Project",
      TechStack: ["Next.js", "Tailwind", "React", "Cloudinary", "Vercel"],
      Features: ["Berita & Informasi Desa", "Agenda Kegiatan Desa", "Galeri Foto & Video", "Profil & Data Desa", "Layanan Surat Online", "Informasi Potensi Desa", "Statistik Penduduk", "Responsive & Modern UI"]
    },
    {
      id: 18,
      Title: "LaporApp KKN",
      Description: "LaporApp KKN is a web-based individual activity report generation application designed specifically for KKN (Kuliah Kerja Nyata) students and volunteers. The application streamlines the process of documenting daily activities, volunteer roles, target groups, and photos. It offers real-time completeness progress tracking, and allows users to export their finished reports into professionally formatted PDF or Microsoft Word (DOCX) files in seconds, all processed client-side in the browser for maximum privacy.",
      Link: "https://laporan-individu.vercel.app/",
      Github: "https://github.com/achsan490",
      Img: "/laporan-individu.png",
      category: "Project",
      TechStack: ["React", "CSS", "Vite", "docx", "jspdf", "html2canvas"],
      Features: ["Step-by-step Report Creator", "Real-time Progress Tracker", "Interactive Identity Forms", "Activity Photo Upload", "Word Document (.docx) Export", "PDF Document (.pdf) Export", "Local Storage Auto-save"]
    },
    {
      id: 17,
      Title: "Caffè POS",
      Description: "Caffè POS is a modern, premium cashier (Point of Sale) web application designed specifically for cafe owners. It features an interactive product catalog with search and category filters, an automated shopping cart with discount code logic, PB1 tax and service fee calculations, multiple payment options (Cash with cash suggestion/change calculator, simulated QRIS, and EDC Card), an operations dashboard visualizing sales metrics and charts, a product catalog management system, and comprehensive transaction logs with export capabilities (JSON/CSV) and print-ready receipts.",
      Link: "https://kasir-cafe-modern.vercel.app/",
      Github: "https://github.com/achsan490",
      Img: "/caffe-pos.png",
      category: "Project",
      TechStack: ["HTML", "CSS", "Javascript", "Lucide Icons", "Vercel"],
      Features: ["Sales Analytics Dashboard", "Cashier POS System", "Menu Management Catalog", "Print-Ready Receipts", "CSV & JSON Export", "Multi-payment Simulations (QRIS/Card/Cash)"]
    },
    {
      id: 14,
      Title: "AI Hunter",
      Description: "AI Hunter is a premium directory platform designed to help users navigate the rapidly evolving AI landscape. The application provides a curated list of top AI tools across various categories, from productivity and development to creative arts. With a focus on user experience, AI Hunter offers powerful search capabilities, detailed tool profiles, and a clean, modern interface that makes discovery effortless.",
      Link: "https://ai-hunter-seven.vercel.app/",
      Github: "https://github.com/achsan490",
      Img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
      category: "Project",
      TechStack: ["React", "Tailwind", "Vite", "Lucide React", "Framer Motion"],
      Features: ["Curated Tool List", "Advanced Search", "Category Filtering", "Tool Detail Pages", "Responsive Design"]
    },
    {
      id: 13,
      Title: "CineStream",
      Description: "CineStream is a modern movie streaming platform that provides users with an immersive cinematic experience. Featuring a clean and intuitive interface, users can browse through a vast collection of movies, view detailed information, and enjoy high-quality streaming. The platform is built with performance in mind, ensuring fast load times and smooth navigation.",
      Link: "https://movie-gules-nine.vercel.app/",
      Github: "https://github.com/achsan490",
      Img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
      category: "Project",
      TechStack: ["React", "Tailwind", "Vite", "Lucide React", "Vercel"],
      Features: ["Movie Library", "Responsive UI", "Search Functionality", "Detailed Movie Info", "Streaming Player"]
    },
    {
      id: 1,
      Title: "Reward System",
      Description: "A comprehensive gamified reward platform designed to boost user engagement. This system allows users to earn points through various activities, track their progress on an interactive dashboard, and redeem points for exciting rewards. The application features a robust backend for transaction management and a sleek, user-friendly frontend.",
      Link: "https://reward-system-two.vercel.app/",
      Github: "https://github.com/achsan490",
      Img: "/reward-system.png",
      category: "Project",
      TechStack: ["React", "Tailwind", "Node.js", "MongoDB", "Express"],
      Features: ["User Dashboard", "Point Tracking", "Redemption System", "Admin Panel", "Transaction History"]
    },
    {
      id: 2,
      Title: "BEM UNWAHA 2025",
      Description: "BEM UNWAHA 2025 is the official digital presence for the Student Executive Board (Badan Eksekutif Mahasiswa) of Universitas KH. A. Wahab Hasbullah for the 2025 period. Under the 'Kabinet Sinergi Perubahan', this platform serves as a vital communication bridge between the organization and the student body. It features comprehensive news sections, event galleries, organizational structure details, and serves as a formal archive for BEM activities.",
      Link: "https://bem-u.vercel.app/",
      Github: "https://github.com/achsan490",
      Img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop",
      category: "Project",
      TechStack: ["React", "Tailwind", "Vite", "Lucide React", "AOS"],
      Features: ["News Management", "Event Calendar", "Organizational Gallery", "Responsive Navigation", "Information Hub"]
    },
    {
      id: 3,
      Title: "Sabana POS",
      Description: "An all-in-one Point of Sale (POS) solution tailored for food and beverage businesses. This application streamlines order taking, inventory management, and sales reporting. It includes features like real-time stock updates, receipt printing integration, and daily revenue analytics to help business owners make informed decisions.",
      Link: "https://sabana-pos.vercel.app/",
      Github: "https://github.com/achsan490",
      Img: "/sabana-pos.png",
      category: "Project",
      TechStack: ["React", "Supabase", "Tailwind", "PostgreSQL", "Recharts"],
      Features: ["Order Management", "Inventory Tracking", "Sales Analytics", "Receipt Generation", "Staff Management"]
    },
    {
      id: 4,
      Title: "MerahPutih Premium Store",
      Description: "MerahPutih Premium Store is a comprehensive e-commerce ecosystem designed for high-end retail experiences. The platform consists of two main components: a robust Admin Control Panel for inventory, order, and sales management, and a sleek, mobile-first user interface for customers. It features real-time stock tracking, automated order notifications, and a premium aesthetic that aligns with modern branding standards.",
      Link: "https://merahputihpremium.free.je/",
      Github: "https://github.com/achsan490",
      Img: "/merahputihstore.png",
      category: "Project",
      TechStack: ["PHP", "MySQL", "Tailwind CSS", "Javascript", "Bootstrap"],
      Features: ["Admin Dashboard", "Mobile-First Design", "Order Management", "Inventory Control", "Revenue Analytics"],
      AdminInfo: {
        Link: "https://merahputihpremium.free.je/admin/index.php",
        Username: "admin",
        Password: "admin123"
      }
    },

    // --- DESIGNS ---
    {
      id: 5,
      Title: "Nexus Mobile App",
      Description: "A conceptual UI/UX design for the Nexus mobile ecosystem. This design focuses on minimalism, accessibility, and user engagement. It features a cohesive color system, intuitive navigation patterns, and fluid micro-interactions that enhance the overall user journey.",
      Link: "#",
      Github: "Private",
      Img: "/mobile-app.png",
      category: "Design",
      TechStack: ["Figma", "Adobe XD", "Prototyping", "UI/UX", "Wireframing"],
      Features: ["User Research", "Interactive Prototype", "Design System", "Accessbility Focused", "Dark Mode UI"]
    },
    {
      id: 6,
      Title: "EduPath Dashboard",
      Description: "An interactive Learning Management System (LMS) dashboard designed to keep students motivated. The layout prioritizes course progress visibility, upcoming deadlines, and achievement badges. The design utilizes a calming color palette suitable for long study sessions.",
      Link: "#",
      Github: "Private",
      Img: "/elearning.png",
      category: "Design",
      TechStack: ["Figma", "Illustrator", "Dashboard Design", "User Flow"],
      Features: ["Progress Visualization", "Gamification Elements", "Calendar Integration", "Responsive Layout", "Clean Typography"]
    },
    {
      id: 7,
      Title: "North Atlantic Brand",
      Description: "A complete corporate identity package for North Atlantic Advisors. This project included logo design, business card layouts, letterhead, and a comprehensive brand style guide. The design communicates trust, professionalism, and stability through the use of strong serif fonts and a deep maritime blue palette.",
      Link: "#",
      Github: "Private",
      Img: "/brand-identity.png",
      category: "Design",
      TechStack: ["Adobe Illustrator", "Photoshop", "Branding", "Print Design"],
      Features: ["Logo Design", "Stationery Kit", "Brand Guidelines", "Typography System", "Visual Strategy"]
    },
    {
      id: 8,
      Title: "Growth Marketing Kit",
      Description: "A versatile set of social media templates designed for high-conversion digital marketing. This kit includes layouts for Instagram Stories, LinkedIn posts, and Facebook ads. The designs are modular, allowing for easy customization of text and imagery while maintaining brand consistency.",
      Link: "#",
      Github: "Private",
      Img: "/social-media.png",
      category: "Design",
      TechStack: ["Photoshop", "Canva", "Social Media", "Marketing Design"],
      Features: ["Instagram Templates", "LinkedIn Banners", "Ad Creatives", "Consistent Branding", "Editable Assets"]
    },

    // --- EDITING ---
    {
      id: 9,
      Title: "Japan Cinematic Vlog",
      Description: "A 4K travel cinematic montage capturing the vibrant culture and serene landscapes of Japan. This project involved advanced color grading to achieve a filmic look, precise sound design to build atmosphere, and seamless transitions that guide the viewer through the journey.",
      Link: "#",
      Github: "Private",
      Img: "/travel-vlog.png",
      category: "Editing",
      TechStack: ["Premiere Pro", "DaVinci Resolve", "Sound Design", "Color Grading"],
      Features: ["4K Workflow", "Cinematic Grading", "Soundscaping", "Storytelling", "Slow Motion"]
    },
    {
      id: 10,
      Title: "Tech Review 2026",
      Description: "A high-energy, fast-paced tech review video designed for YouTube. The edit features dynamic text overlays, smooth b-roll integration, and engaging pacing to retain viewer attention. Special attention was paid to motion graphics for specification breakdowns.",
      Link: "#",
      Github: "Private",
      Img: "/tech-review.png",
      category: "Editing",
      TechStack: ["Premiere Pro", "After Effects", "Motion Graphics", "YouTube"],
      Features: ["Dynamic Cuts", "Text Overlays", "B-Roll Sync", "Audio Mixing", "Engaging Intro"]
    },
    {
      id: 11,
      Title: "Corporate Vision",
      Description: "A polished promotional video highlighting a company's core values and vision. This project utilized clean lower-thirds, professional voiceover mixing, and a corporate music bed to create an inspiring and trustworthy tone. Ideal for website headers and investor presentations.",
      Link: "#",
      Github: "Private",
      Img: "/corporate-promo.png",
      category: "Editing",
      TechStack: ["Premiere Pro", "After Effects", "Corporate Video", "Audio Fixing"],
      Features: ["Interview Editing", "Clean Graphics", "Color Correction", "BG Music Mixing", "Brand Overlay"]
    },
    {
      id: 12,
      Title: "Urban Energy",
      Description: "A viral-style short-form video optimized for TikTok and Instagram Reels. The edit uses trendy visual effects, rapid cuts, and beat-syncing to create a high-energy visual experience that encourages shares and loops.",
      Link: "#",
      Github: "Private",
      Img: "/short-form.png",
      category: "Editing",
      TechStack: ["CapCut", "After Effects", "Vertical Video", "Social Trends"],
      Features: ["Beat Sync", "Visual Effects", "Subtitles", "Vertical  Format", "Viral Hooks"]
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    // Try to find project in hardcoded list
    const selectedProject = allProjects.find((p) => String(p.id) === id);

    // If not found (or if we want to fallback to localStorage/Supabase logic later),
    // we can add it here. For now, since we have the master list, we use it directly.
    // This ensures consistency even if localStorage is empty.

    if (selectedProject) {
      setProject(selectedProject);
    } else {
      // Handle case where project isn't found even in our master list
      // Maybe try localStorage as a last resort in case of dynamic updates not in our list
      const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
      const localProject = storedProjects.find((p) => String(p.id) === id);
      if (localProject) {
        setProject({
          ...localProject,
          Features: localProject.Features || [],
          TechStack: localProject.TechStack || [],
          Github: localProject.Github || 'https://github.com/achsan490',
        });
      }
    }
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-white">Loading Project...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] px-[2%] sm:px-0 relative overflow-hidden">
      {/* Background animations remain unchanged */}
      <div className="fixed inset-0">
        <div className="absolute -inset-[10px] opacity-20">
          <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12 animate-fadeIn">
            <button
              onClick={() => navigate(-1)}
              className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-white/5 backdrop-blur-xl rounded-xl text-white/90 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 text-sm md:text-base"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-white/50">
              <span>Projects</span>
              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-white/90 truncate">{project.Title}</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-6 md:space-y-10 animate-slideInLeft">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-blue-200 via-cyan-200 to-sky-200 bg-clip-text text-transparent leading-tight">
                  {project.Title}
                </h1>
                <div className="relative h-1 w-16 md:w-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-sm" />
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-base md:text-lg text-gray-300/90 leading-relaxed">
                  {project.Description}
                </p>
              </div>

              {project.AdminInfo && (
                <div className="p-4 md:p-5 rounded-2xl bg-white/[0.02] border border-blue-500/20 backdrop-blur-xl space-y-3 relative overflow-hidden group hover:border-blue-500/40 transition-colors duration-300 animate-fadeIn">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
                  <div className="flex items-center gap-2.5 text-blue-400 font-semibold">
                    <Lock className="w-5 h-5" />
                    <span>Demo Admin Panel</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Akses dashboard admin untuk mengelola produk, transaksi, dan data penjualan menggunakan link dan kredensial berikut:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm">
                    <div className="bg-[#0a0a1a]/50 p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Admin Panel Link</span>
                      <a 
                        href={project.AdminInfo.Link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1.5 transition-colors mt-1"
                      >
                        Go to Admin Panel <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <div className="bg-[#0a0a1a]/50 p-3 rounded-xl border border-white/5 flex flex-col justify-center">
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Login Credentials</span>
                      <div className="text-gray-300 mt-1 flex flex-wrap items-center gap-1 text-xs sm:text-sm">
                        <span>User:</span>
                        <code className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono font-bold">{project.AdminInfo.Username}</code>
                        <span className="mx-1">|</span>
                        <span>Pass:</span>
                        <code className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono font-bold">{project.AdminInfo.Password}</code>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <ProjectStats project={project} />

              <div className="flex flex-wrap gap-3 md:gap-4">
                {/* Action buttons */}
                <a
                  href={project.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 hover:from-blue-600/20 hover:to-cyan-600/20 text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-blue-600/10 to-cyan-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <ExternalLink className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative font-medium">Live Demo</span>
                </a>

                <a
                  href={project.Github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-cyan-600/10 to-sky-600/10 hover:from-cyan-600/20 hover:to-sky-600/20 text-cyan-300 rounded-xl transition-all duration-300 border border-cyan-500/20 hover:border-cyan-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                  onClick={(e) => !handleGithubClick(project.Github) && e.preventDefault()}
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-gradient-to-r from-cyan-600/10 to-sky-600/10 transition-transform duration-300 group-hover:translate-y-[0%]" />
                  <Github className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative font-medium">Github</span>
                </a>
              </div>

              <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-white/90 mt-[3rem] md:mt-0 flex items-center gap-2 md:gap-3">
                  <Code2 className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  Technologies Used
                </h3>
                {project.TechStack.length > 0 ? (
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {project.TechStack.map((tech, index) => (
                      <TechBadge key={index} tech={tech} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-gray-400 opacity-50">No technologies added.</p>
                )}
              </div>
            </div>

            <div className="space-y-6 md:space-y-10 animate-slideInRight">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">

                <div className="absolute inset-0 bg-gradient-to-t from-[#030014] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src={project.Img}
                  alt={project.Title}
                  className="w-full  object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                  onLoad={() => setIsImageLoaded(true)}
                />
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 transition-colors duration-300 rounded-2xl" />
              </div>

              {/* Fitur Utama */}
              <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 space-y-6 hover:border-white/20 transition-colors duration-300 group">
                <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                  Key Features
                </h3>
                {project.Features.length > 0 ? (
                  <ul className="list-none space-y-2">
                    {project.Features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 opacity-50">No features added.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.7s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.7s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetails;
