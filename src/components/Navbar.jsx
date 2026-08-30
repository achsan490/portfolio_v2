import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "../supabase";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const [profileName, setProfileName] = useState("Achsanul Khuluq Izzulchaq");

    const navItems = [
        { href: "#Home", label: "Home" },
        { href: "#About", label: "About" },
        { href: "#Portofolio", label: "Portofolio" },
        { href: "#Contact", label: "Contact" },
    ];

    // Fetch profile name
    useEffect(() => {
        const fetchProfileName = async () => {
            if (!supabase) return;

            try {
                const { data, error } = await supabase
                    .from('profile_settings')
                    .select('name')
                    .eq('id', 1)
                    .single();

                if (error) throw error;
                if (data?.name) setProfileName(data.name);
            } catch (error) {
                console.error('Error fetching profile name:', error);
            }
        };

        fetchProfileName();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            const sections = navItems.map(item => {
                const section = document.querySelector(item.href);
                if (section) {
                    return {
                        id: item.href.replace("#", ""),
                        offset: section.offsetTop - 550,
                        height: section.offsetHeight
                    };
                }
                return null;
            }).filter(Boolean);

            const currentPosition = window.scrollY;
            const active = sections.find(section =>
                currentPosition >= section.offset &&
                currentPosition < section.offset + section.height
            );

            if (active) {
                setActiveSection(active.id);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        const section = document.querySelector(href);
        if (section) {
            const top = section.offsetTop - 100;
            window.scrollTo({
                top: top,
                behavior: "smooth"
            });
        }
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-500 ${isOpen
                ? "bg-[#030305] border-b border-white/10"
                : scrolled
                    ? "bg-[#030305]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                    : "bg-transparent"
                }`}
        >
            <div className="mx-auto px-[5%] sm:px-[5%] lg:px-[10%]">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo & Brand */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                        <img src="/Logo.png" alt="Logo" className="h-8 w-8 sm:h-9 sm:w-9 object-contain filter brightness-110" />
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent whitespace-nowrap"
                        >
                            San Project
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-8 flex items-center space-x-1 p-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
                            {navItems.map((item) => {
                                const isActive = activeSection === item.href.substring(1);
                                return (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        onClick={(e) => scrollToSection(e, item.href)}
                                        className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                                            isActive
                                                ? "text-black bg-white shadow-md shadow-white/10 font-semibold"
                                                : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                                        }`}
                                    >
                                        {item.label}
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 text-zinc-300 hover:text-white rounded-lg bg-white/[0.04] border border-white/10 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                        >
                            {isOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out bg-[#030305]/95 backdrop-blur-2xl border-b border-white/10 ${isOpen
                    ? "max-h-screen opacity-100 py-4 px-6"
                    : "max-h-0 opacity-0 overflow-hidden py-0 px-6"
                    }`}
            >
                <div className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.href.substring(1);
                        return (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => scrollToSection(e, item.href)}
                                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? "text-black bg-white font-semibold"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
