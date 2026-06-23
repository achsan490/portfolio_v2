import React, { useEffect, useState, useCallback } from "react";

import { supabase } from "../supabase";

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
    // Check if Supabase is configured
    if (!supabase) {
      console.warn("⚠️ Supabase not configured. Using default data.");
      setProjects(defaultProjects);
      setCertificates(defaultCertificates);
      setTechStacks(defaultTechStacks);
      localStorage.setItem("projects", JSON.stringify(defaultProjects));
      localStorage.setItem("certificates", JSON.stringify(defaultCertificates));
      localStorage.setItem("tech_stack", JSON.stringify(defaultTechStacks));
      return;
    }

    try {
      // Mengambil data dari Supabase secara paralel
      setTechStackLoading(true);
      const [projectsResponse, certificatesResponse, techStackResponse] = await Promise.all([
        supabase.from("projects").select("*").order('id', { ascending: true }),
        supabase.from("certificates").select("*").order('id', { ascending: true }),
        supabase.from("tech_stack").select("*").order('sort_order', { ascending: true }),
      ]);

      // Error handling untuk setiap request
      if (projectsResponse.error) {
        console.error('Projects fetch error:', projectsResponse.error);
        throw projectsResponse.error;
      }
      if (certificatesResponse.error) {
        console.error('Certificates fetch error:', certificatesResponse.error);
        throw certificatesResponse.error;
      }
      if (techStackResponse.error) {
        console.error('Tech stack fetch error:', techStackResponse.error);
      }

      // Supabase mengembalikan data dalam properti 'data'
      const projectData = projectsResponse.data || [];
      const certificateData = certificatesResponse.data || [];
      const techStackData = techStackResponse?.data || [];

      // Jika data kosong (table kosong), gunakan default
      setProjects(projectData.length > 0 ? projectData : defaultProjects);
      setCertificates(certificateData.length > 0 ? certificateData : defaultCertificates);

      if (!techStackResponse.error) {
        const normalizedTechStack = normalizeTechStack(techStackData);
        setTechStacks(normalizedTechStack.length > 0 ? normalizedTechStack : defaultTechStacks);
        localStorage.setItem("tech_stack", JSON.stringify(normalizedTechStack));
      }

      // Store in localStorage (fungsionalitas ini tetap dipertahankan)
      if (projectData.length > 0) localStorage.setItem("projects", JSON.stringify(projectData));
      if (certificateData.length > 0) localStorage.setItem("certificates", JSON.stringify(certificateData));

    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
      // Fallback to default if error matches "null" or connection issues
      setProjects(prev => prev.length > 0 ? prev : defaultProjects);
    } finally {
      setTechStackLoading(false);
    }
  }, []);



  useEffect(() => {
    // Coba ambil dari localStorage dulu untuk laod lebih cepat
    const cachedProjects = localStorage.getItem('projects');
    const cachedCertificates = localStorage.getItem('certificates');
    const cachedTechStack = localStorage.getItem('tech_stack');

    if (cachedProjects && cachedCertificates) {
      setProjects(JSON.parse(cachedProjects));
      setCertificates(JSON.parse(cachedCertificates));
    }
    if (cachedTechStack) {
      setTechStacks(JSON.parse(cachedTechStack));
    }

    fetchData(); // Tetap panggil fetchData untuk sinkronisasi data terbaru
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

  // Sisa dari komponen (return statement) tidak ada perubahan
  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] overflow-hidden" id="Portofolio">
      {/* Header section - unchanged */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#3b82f6]">
          <span style={{
            color: '#2563eb',
            backgroundImage: 'linear-gradient(45deg, #2563eb 10%, #3b82f6 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Portfolio Showcase
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, and technical expertise.
          Each section represents a milestone in my continuous learning path.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - unchanged */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
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
              background: "linear-gradient(180deg, rgba(59, 130, 246, 0.03) 0%, rgba(37, 99, 235, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          {/* Tabs remain unchanged */}
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(59, 130, 246, 0.2)",
                  "& .lucide": {
                    color: "#a78bfa",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Projects"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Certificates"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
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
              <div className="inline-flex bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-1.5 sm:p-2 gap-1 sm:gap-2 min-w-max">
                {['Project', 'Design', 'Editing'].map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowAllProjects(false); // Reset show all saat ganti kategori
                    }}
                    className={`
                      px-4 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-400 whitespace-nowrap
                      ${selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
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
