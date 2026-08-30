import React, { useState, useEffect, useCallback, memo } from "react"
import { Github, Linkedin, Mail, ExternalLink, Instagram, MessageCircle, Sparkles, Code2, CloudDownload, Cpu, ShieldCheck, Server, Terminal, ArrowUpRight } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { supabase } from "../supabase"
import { getStoredProfile } from "../utils/portfolioStorage"

// Memoized Components
const StatusBadge = memo(() => (
  <div className="inline-block animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-400 to-white rounded-full blur-md opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      <div className="relative px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0a0a0f]/90 backdrop-blur-xl border border-white/10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-transparent bg-clip-text sm:text-xs text-[0.68rem] font-medium tracking-wide uppercase">
          Ready to Innovate
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(({ title }) => {
  const words = title.split(' ');
  const firstLine = words.slice(0, 2).join(' ');
  const secondLine = words.slice(2).join(' ');

  return (
    <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight" style={{ letterSpacing: '-0.03em', fontFamily: "'Space Grotesk', 'Poppins', sans-serif" }}>
        {/* First Line */}
        <span className="relative inline-block">
          <span className="relative bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent">
            {firstLine}
          </span>
        </span>

        {/* Second Line */}
        {secondLine && (
          <>
            <br />
            <span className="relative inline-block mt-1">
              <span className="relative bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-500 bg-clip-text text-transparent">
                {secondLine}
              </span>
            </span>
          </>
        )}
      </h1>
    </div>
  );
});

const TechStack = memo(({ tech }) => (
  <div className="px-3.5 py-1.5 hidden sm:inline-flex items-center rounded-full bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] text-xs text-zinc-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => {
  const isPrimary = text === 'Projects';
  return (
    <a href={href} className="inline-block">
      <button className={`group relative px-6 h-11 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all duration-300 ${
        isPrimary
          ? "bg-white text-black hover:bg-zinc-200 shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95 font-semibold"
          : "bg-white/[0.04] text-zinc-200 border border-white/10 hover:bg-white/[0.09] hover:border-white/20 hover:text-white hover:scale-105 active:scale-95 backdrop-blur-md"
      }`}>
        <span>{text}</span>
        <Icon className={`w-3.5 h-3.5 transition-transform duration-300 ${isPrimary ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : 'group-hover:translate-x-1'}`} />
      </button>
    </a>
  );
});

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="group relative p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 hover:scale-110 active:scale-95">
      <Icon className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
    </button>
  </a>
));

const LaptopShowcase = memo(() => (
  <div className="relative w-full max-w-[640px] sm:max-w-[720px] aspect-[4/3]">
    {/* Ambient Outer Monochrome Glows */}
    <div
      className="absolute -inset-16 opacity-40 blur-3xl"
      style={{
        background: "radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 60%)"
      }}
    />
    <div
      className="absolute -inset-12 opacity-30 blur-3xl"
      style={{
        background: "radial-gradient(circle at bottom, rgba(160,160,175,0.06), transparent 60%)"
      }}
    />

    {/* Outer Chassis */}
    <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-white/15 via-white/5 to-transparent opacity-80" />
    <div className="absolute inset-[1px] rounded-[35px] bg-gradient-to-br from-[#0a0a0f]/95 via-[#0e0e14]/90 to-[#07070a]/95 border border-white/10 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.8)]">
      <div
        className="absolute inset-0 rounded-[34px] opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />
      <div className="absolute inset-0 rounded-[34px] overflow-hidden">
        <div className="absolute -top-1/2 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 via-white/[0.02] to-transparent animate-scanline" />
        <div className="absolute top-0 -left-full h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 animate-[shine_6s_ease-in-out_infinite]" />
      </div>

      {/* Top Header Bar */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.35em] text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="font-semibold text-zinc-200">System Online</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-400 font-mono font-medium">v2.5.0</span>
          <span className="text-zinc-500">IT Core</span>
        </div>
      </div>

      {/* Inner Screen Display (Fully Populated & Structured) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[86%] sm:w-[82%] h-[74%] translate-y-1">
          <div className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-white/20 via-white/5 to-white/10 p-[1px]">
            <div className="absolute inset-[1px] rounded-[21px] bg-gradient-to-br from-[#0c0c12]/98 via-[#101018]/95 to-[#08080c]/98 border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.8)] p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 rounded-[21px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_70%)]" />

              {/* Console Window Topbar */}
              <div className="relative flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                  <span className="ml-2 font-mono text-[0.62rem] text-zinc-400 flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-zinc-300" />
                    san@terminal:~$
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[0.52rem] text-zinc-300 font-mono">LIVE CLOUD</span>
                  <span className="text-[0.52rem] uppercase tracking-[0.2em] text-zinc-500">console</span>
                </div>
              </div>

              {/* Middle Grid: Code Snippet + Live Metrics */}
              <div className="relative grid grid-cols-1 sm:grid-cols-[1.3fr_0.9fr] gap-2.5 my-auto py-1">
                {/* Code Window */}
                <div className="rounded-xl bg-black/60 border border-white/10 p-2.5 sm:p-3 backdrop-blur-sm space-y-1.5 font-mono text-[0.60rem] sm:text-[0.66rem] leading-relaxed">
                  <div className="flex items-center justify-between text-zinc-400 text-[0.52rem] pb-1 border-b border-white/5">
                    <span className="flex items-center gap-1 text-zinc-300">
                      <Code2 className="w-3 h-3 text-zinc-400" />
                      developer.config.ts
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Compiled
                    </span>
                  </div>
                  <div className="text-zinc-300 space-y-0.5">
                    <p><span className="text-zinc-400">const</span> <span className="text-white font-semibold">developer</span> = &#123;</p>
                    <p className="pl-3"><span className="text-zinc-400">name</span>: <span className="text-emerald-300">"M. Achsanul Khuluq"</span>,</p>
                    <p className="pl-3"><span className="text-zinc-400">role</span>: <span className="text-emerald-300">"Simple-Stack Dev"</span>,</p>
                    <p className="pl-3"><span className="text-zinc-400">skills</span>: [<span className="text-zinc-200">"React"</span>, <span className="text-zinc-200">"Next.js"</span>, <span className="text-zinc-200">"PHP"</span>],</p>
                    <p className="pl-3"><span className="text-zinc-400">status</span>: <span className="text-zinc-200">"Ready for Work"</span></p>
                    <p>&#125;;</p>
                  </div>
                </div>

                {/* Live Runtime & Stats */}
                <div className="space-y-2">
                  <div className="rounded-xl bg-white/[0.03] border border-white/10 p-2.5 backdrop-blur-sm space-y-1.5">
                    <div className="flex items-center justify-between text-[0.52rem] uppercase tracking-[0.15em] text-zinc-400">
                      <span className="flex items-center gap-1 text-zinc-300">
                        <Cpu className="w-3 h-3 text-zinc-400" />
                        CPU Load
                      </span>
                      <span className="text-white font-mono font-bold">18%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[18%] rounded-full bg-gradient-to-r from-zinc-300 to-white" />
                    </div>

                    <div className="flex items-center justify-between text-[0.52rem] uppercase tracking-[0.15em] text-zinc-400 pt-0.5">
                      <span className="flex items-center gap-1 text-zinc-300">
                        <Server className="w-3 h-3 text-zinc-400" />
                        RAM Usage
                      </span>
                      <span className="text-white font-mono font-bold">2.4 / 16 GB</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-zinc-400 to-zinc-200" />
                    </div>
                  </div>

                  {/* Micro Tech Tags */}
                  <div className="grid grid-cols-2 gap-1.5 text-[0.55rem] font-mono">
                    <div className="px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 flex items-center justify-between">
                      <span>HTTP/2</span>
                      <span className="text-emerald-400 font-bold">200 OK</span>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 flex items-center justify-between">
                      <span>LATENCY</span>
                      <span className="text-zinc-200 font-bold">12ms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Bar */}
              <div className="relative flex items-center justify-between pt-1.5 border-t border-white/10 text-[0.55rem] text-zinc-400 font-mono">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    build success
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-300">0 vulnerabilities</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500">Uptime:</span>
                  <span className="text-zinc-200 font-bold">99.98%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Laptop Shelf Base */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-[14%] w-[114%] h-[20%] rounded-[24px] bg-gradient-to-b from-[#0e0e14]/95 to-[#08080c]/90 border border-white/10 shadow-[0_14px_30px_rgba(0,0,0,0.8)]">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-1.5 rounded-full bg-white/15" />
            <div className="absolute bottom-2 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      </div>

      {/* Floating Badges */}
      <div className="absolute left-5 top-16 hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 border border-white/10 text-[0.65rem] text-zinc-300 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] animate-float">
        <Terminal className="w-4 h-4 text-zinc-300" />
        <span>CLI Shell</span>
      </div>
      <div className="absolute right-5 top-16 hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 border border-white/10 text-[0.65rem] text-zinc-300 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] animate-float-delayed">
        <CloudDownload className="w-4 h-4 text-zinc-300" />
        <span>Cloud Sync</span>
      </div>
      <div className="absolute left-8 bottom-16 hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 border border-white/10 text-[0.65rem] text-zinc-300 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] animate-float-delayed">
        <Server className="w-4 h-4 text-zinc-300" />
        <span>Server Node</span>
      </div>
      <div className="absolute right-8 bottom-16 hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 border border-white/10 text-[0.65rem] text-zinc-300 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] animate-float">
        <ShieldCheck className="w-4 h-4 text-zinc-300" />
        <span>Secure</span>
      </div>
    </div>
  </div>
));

// Constants
const TYPING_SPEED = 100;
const ERASING_SPEED = 50;
const PAUSE_DURATION = 2000;

const Home = () => {
  const [text, setText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const [profileData, setProfileData] = useState({
    title: "simple-stack developer",
    subtitle: ["Web Developer", "UI/UX Design", "Mobile Developer", "Tech Enthusiast"],
    tech_stack: ["React", "JavaScript", "Node.js", "Python", "Tailwind", "Next.js", "MongoDB", "Express"],
    social_links: [
      { icon: Github, link: "https://github.com/achsan490" },
      { icon: Linkedin, link: "https://www.linkedin.com/in/san-project-41a03029b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
      { icon: Instagram, link: "https://www.instagram.com/sannn.io" },
      { icon: MessageCircle, link: "https://wa.me/6283839976681?text=Halo%20Achsanul!%20Saya%20melihat%20portofolio%20Anda%20dan%20tertarik%20untuk%20berdiskusi." }
    ]
  });

  useEffect(() => {
    const fetchProfile = async () => {
      let data = null;
      if (supabase) {
        try {
          const { data: dbData } = await supabase
            .from('profile_settings')
            .select('*')
            .maybeSingle();
          if (dbData) data = dbData;
        } catch (error) {
          console.warn('Error fetching profile from Supabase:', error);
        }
      }

      if (!data) {
        data = getStoredProfile();
      }

      if (data) {
        let subtitleArray = ["Web Developer", "UI/UX Design", "Mobile Developer", "Tech Enthusiast"];
        if (data.subtitle) {
          if (typeof data.subtitle === 'string') {
            subtitleArray = data.subtitle.includes('|')
              ? data.subtitle.split('|').map(s => s.trim())
              : [data.subtitle, "Tech Enthusiast"];
          } else if (Array.isArray(data.subtitle)) {
            subtitleArray = data.subtitle;
          }
        }

        const titleVal = (!data.title || data.title.toLowerCase() === 'frontend developer')
          ? 'Simple-Stack Developer'
          : data.title;

        setProfileData({
          title: titleVal,
          subtitle: subtitleArray,
          tech_stack: data.tech_stack || ["React", "JavaScript", "Node.js", "Python", "Tailwind", "Next.js", "MongoDB", "Express"],
          social_links: [
            { icon: Github, link: data.github_url || "https://github.com/achsan490" },
            { icon: Linkedin, link: data.linkedin_url || "#" },
            { icon: Instagram, link: data.instagram_url || "#" }
          ]
        });
      }
    };

    fetchProfile();

    window.addEventListener('portfolio_profile_updated', fetchProfile);
    return () => {
      window.removeEventListener('portfolio_profile_updated', fetchProfile);
    };
  }, []);

  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        once: true,
        offset: 10,
      });
    };

    initAOS();
    window.addEventListener('resize', initAOS);
    return () => window.removeEventListener('resize', initAOS);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    return () => setIsLoaded(false);
  }, []);

  const handleTyping = useCallback(() => {
    const WORDS = profileData.subtitle;
    if (isTyping) {
      if (charIndex < WORDS[wordIndex].length) {
        setText(prev => prev + WORDS[wordIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => setIsTyping(false), PAUSE_DURATION);
      }
    } else {
      if (charIndex > 0) {
        setText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else {
        setWordIndex(prev => (prev + 1) % WORDS.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, wordIndex, profileData.subtitle]);

  useEffect(() => {
    const timeout = setTimeout(
      handleTyping,
      isTyping ? TYPING_SPEED : ERASING_SPEED
    );
    return () => clearTimeout(timeout);
  }, [handleTyping]);

  return (
    <div className="min-h-screen bg-transparent overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] pt-32 sm:pt-20 md:pt-0" id="Home">
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto min-h-screen">
          <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen md:justify-between gap-8 sm:gap-12 lg:gap-20">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0"
              data-aos="fade-right"
              data-aos-delay="200">
              <div className="space-y-4 sm:space-y-6">
                <StatusBadge />

                <MainTitle title={profileData.title} />

                {/* Typing Subtitle */}
                <div className="h-8 flex items-center" data-aos="fade-up" data-aos-delay="800">
                  <span className="text-xl md:text-2xl font-light text-zinc-300 font-mono">
                    {text}
                  </span>
                  <span className="w-[2px] h-6 bg-white ml-1.5 animate-pulse"></span>
                </div>

                {/* Description */}
                <p className="text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed font-normal"
                  data-aos="fade-up"
                  data-aos-delay="1000">
                  A passionate simple-stack developer with expertise in building modern, scalable web applications. I specialize in creating seamless user experiences through clean code and innovative solutions. With a strong foundation in both frontend and backend technologies, I transform ideas into powerful digital products that make a difference.
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 justify-start" data-aos="fade-up" data-aos-delay="1200">
                  {profileData.tech_stack.map((tech, index) => (
                    <TechStack key={index} tech={tech} />
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-row gap-3.5 w-full justify-start pt-2" data-aos="fade-up" data-aos-delay="1400">
                  <CTAButton href="#Portofolio" text="Projects" icon={ArrowUpRight} />
                  <CTAButton href="#Contact" text="Contact" icon={Mail} />
                </div>

                {/* Social Links */}
                <div className="flex gap-2.5 justify-start pt-2" data-aos="fade-up" data-aos-delay="1600">
                  {profileData.social_links.map((social, index) => (
                    <SocialLink key={index} icon={social.icon} link={social.link} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - IT Laptop Scene */}
            <div className="w-full py-0 sm:py-0 lg:w-1/2 h-auto lg:min-h-[750px] xl:min-h-[850px] relative flex items-center justify-center order-2 lg:order-2 mt-0 lg:mt-0"
              data-aos="fade-left"
              data-aos-delay="600"
              style={{ overflow: 'visible', perspective: '2000px' }}>

              <LaptopShowcase />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Home);
