export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const DEFAULT_PROJECTS = [
    {
        id: 26,
        Title: "TypeCraft Pro",
        Description: "TypeCraft Pro — Minimalist Typing Test & Arcade Defense. Platform tes kecepatan mengetik profesional dengan analitik WPM presisi, sound effect keyboard mekanik, real-time feedback, dan mode arcade Word Defense.",
        Link: "https://type-craft-pro.vercel.app/",
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

export const DEFAULT_CERTIFICATES = [
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

export const DEFAULT_TECH_STACK = [
    { id: 1, name: "HTML", icon_url: "html.svg", sort_order: 1 },
    { id: 2, name: "CSS", icon_url: "css.svg", sort_order: 2 },
    { id: 3, name: "JavaScript", icon_url: "javascript.svg", sort_order: 3 },
    { id: 4, name: "Tailwind CSS", icon_url: "tailwind.svg", sort_order: 4 },
    { id: 5, name: "ReactJS", icon_url: "reactjs.svg", sort_order: 5 },
    { id: 6, name: "Vite", icon_url: "vite.svg", sort_order: 6 },
    { id: 7, name: "Node JS", icon_url: "nodejs.svg", sort_order: 7 },
    { id: 8, name: "Bootstrap", icon_url: "bootstrap.svg", sort_order: 8 },
    { id: 9, name: "Firebase", icon_url: "firebase.svg", sort_order: 9 },
    { id: 10, name: "Material UI", icon_url: "MUI.svg", sort_order: 10 },
    { id: 11, name: "Vercel", icon_url: "vercel.svg", sort_order: 11 },
    { id: 12, name: "SweetAlert2", icon_url: "SweetAlert.svg", sort_order: 12 },
    { id: 13, name: "Canva", icon_url: "canva.svg", sort_order: 13 },
    { id: 14, name: "Adobe Animate", icon_url: "adobe-animate.svg", sort_order: 14 },
    { id: 15, name: "Adobe Photoshop", icon_url: "photoshop.svg", sort_order: 15 },
    { id: 16, name: "Capcut", icon_url: "capcut.svg", sort_order: 16 },
    { id: 17, name: "Figma", icon_url: "figma.svg", sort_order: 17 }
];

export const DEFAULT_PROFILE = {
    photo_url: '',
    title: 'Frontend Developer',
    subtitle: 'Web Developer|Design|Video & Photo Editing|UI/UX Design',
    tech_stack: ['React', 'Javascript', 'Node.js', 'Tailwind', 'Next.js', 'PHP', 'MySQL'],
    github_url: 'https://github.com/achsan490',
    linkedin_url: 'https://www.linkedin.com/in/achsanul-khuluq-izzulchaq-41a03029b',
    instagram_url: 'https://www.instagram.com/sannn.io',
    name: 'M. Achsanul Khuluq Izzulchaq',
    description: 'Saya adalah mahasiswa lulusan S1 Teknik Informatika yang siap memulai jenjang karir baru sebagai freshgraduate, sebelumnya saya pernah memiliki pengalaman dalam pengembangan aplikasi web, sistem informasi, serta proyek berbasis Next.js, PHP, dan MySQL.',
    cv_link: '/CV_Achsanul_Khuluq.jpg',
    linkedin_connect: 'https://www.linkedin.com/in/achsanul-khuluq-izzulchaq-41a03029b',
    instagram_connect: 'https://www.instagram.com/sannn.io',
    youtube_connect: '',
    github_connect: 'https://github.com/achsan490',
    tiktok_connect: 'https://www.tiktok.com/@sann.io'
};

// Projects Storage Helpers
export const getStoredProjects = () => {
    try {
        const saved = localStorage.getItem("projects");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                const existingIds = new Set(parsed.map(p => p.id));
                const missingDefaults = DEFAULT_PROJECTS.filter(p => !existingIds.has(p.id));
                if (missingDefaults.length > 0) {
                    const merged = [...missingDefaults, ...parsed];
                    localStorage.setItem("projects", JSON.stringify(merged));
                    return merged;
                }
                return parsed;
            }
        }
        localStorage.setItem("projects", JSON.stringify(DEFAULT_PROJECTS));
        return DEFAULT_PROJECTS;
    } catch (e) {
        return DEFAULT_PROJECTS;
    }
};

export const saveStoredProjects = (projects) => {
    try {
        localStorage.setItem("projects", JSON.stringify(projects));
        window.dispatchEvent(new Event("portfolio_projects_updated"));
    } catch (e) {
        console.error(e);
    }
};

// Certificates Storage Helpers
export const getStoredCertificates = () => {
    try {
        const saved = localStorage.getItem("certificates");
        if (saved) return JSON.parse(saved);
        localStorage.setItem("certificates", JSON.stringify(DEFAULT_CERTIFICATES));
        return DEFAULT_CERTIFICATES;
    } catch (e) {
        return DEFAULT_CERTIFICATES;
    }
};

export const saveStoredCertificates = (certificates) => {
    try {
        localStorage.setItem("certificates", JSON.stringify(certificates));
        window.dispatchEvent(new Event("portfolio_certificates_updated"));
    } catch (e) {
        console.error(e);
    }
};

// TechStack Storage Helpers
export const getStoredTechStack = () => {
    try {
        const saved = localStorage.getItem("tech_stack");
        if (saved) return JSON.parse(saved);
        localStorage.setItem("tech_stack", JSON.stringify(DEFAULT_TECH_STACK));
        return DEFAULT_TECH_STACK;
    } catch (e) {
        return DEFAULT_TECH_STACK;
    }
};

export const saveStoredTechStack = (techStack) => {
    try {
        localStorage.setItem("tech_stack", JSON.stringify(techStack));
        window.dispatchEvent(new Event("portfolio_techstack_updated"));
    } catch (e) {
        console.error(e);
    }
};

// Profile Storage Helpers
export const getStoredProfile = () => {
    try {
        const saved = localStorage.getItem("profile_settings");
        if (saved) return JSON.parse(saved);
        localStorage.setItem("profile_settings", JSON.stringify(DEFAULT_PROFILE));
        return DEFAULT_PROFILE;
    } catch (e) {
        return DEFAULT_PROFILE;
    }
};

export const saveStoredProfile = (profile) => {
    try {
        localStorage.setItem("profile_settings", JSON.stringify(profile));
        window.dispatchEvent(new Event("portfolio_profile_updated"));
    } catch (e) {
        console.error(e);
    }
};
