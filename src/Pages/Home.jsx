import React, { useState, useEffect, useCallback, memo } from "react"
import { Github, Linkedin, Mail, ExternalLink, Instagram, MessageCircle, Sparkles, Code2, CloudDownload, Cpu, ShieldCheck, Server, Terminal } from "lucide-react"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { supabase } from "../supabase"


// Memoized Components
const StatusBadge = memo(() => (
  <div className="inline-block animate-float lg:mx-0" data-aos="zoom-in" data-aos-delay="400">
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative px-3 sm:px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10">
        <span className="bg-gradient-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text sm:text-sm text-[0.7rem] font-medium flex items-center">
          <Sparkles className="sm:w-4 sm:h-4 w-3 h-3 mr-2 text-blue-400" />
          Ready to Innovate
        </span>
      </div>
    </div>
  </div>
));

const MainTitle = memo(({ title }) => {
  // Split title into words for better formatting - add space between words
  const words = title.split(' ');

  // Group words: first 1-2 words on first line, rest on second line
  const firstLine = words.slice(0, 2).join('  '); // double space
  const secondLine = words.slice(2).join('  '); // double space

  return (
    <div className="space-y-3" data-aos="fade-up" data-aos-delay="600">
      <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-bold" style={{ letterSpacing: '0.01em', fontFamily: "'Sora', sans-serif", fontWeight: 800 }}>
        {/* First Line */}
        <span className="relative inline-block">
          <span className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-blue-600 blur-2xl opacity-20"></span>
          <span className="relative bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
            {firstLine}
          </span>
        </span>

        {/* Second Line (if exists) */}
        {secondLine && (
          <>
            <br />
            <span className="relative inline-block mt-2">
              <span className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-blue-600 blur-2xl opacity-20"></span>
              <span className="relative bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
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
  <div className="px-4 py-2 hidden sm:block rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition-colors">
    {tech}
  </div>
));

const CTAButton = memo(({ href, text, icon: Icon }) => (
  <a href={href}>
    <button className="group relative w-[160px]">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl opacity-50 blur-md group-hover:opacity-90 transition-all duration-700"></div>
      <div className="relative h-11 bg-[#020617] backdrop-blur-xl rounded-lg border border-white/10 leading-none overflow-hidden">
        <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-gradient-to-r from-blue-500/20 to-blue-600/20"></div>
        <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm group-hover:gap-3 transition-all duration-300">
          <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-medium z-10">
            {text}
          </span>
          <Icon className={`w-4 h-4 text-gray-200 ${text === 'Contact' ? 'group-hover:translate-x-1' : 'group-hover:rotate-45'} transform transition-all duration-300 z-10`} />
        </span>
      </div>
    </button>
  </a>
));

const SocialLink = memo(({ icon: Icon, link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <button className="group relative p-3">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
      <div className="relative rounded-xl bg-black/50 backdrop-blur-xl p-2 flex items-center justify-center border border-white/10 group-hover:border-blue-500/30 transition-all duration-300">
        <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
      </div>
    </button>
  </a>
));

const LaptopShowcase = memo(() => (
  <div className="relative w-full max-w-[640px] sm:max-w-[720px] aspect-[4/3]">
    <div
      className="absolute -inset-16 opacity-70 blur-3xl"
      style={{
        background: "radial-gradient(circle at top, rgba(59,130,246,0.35), transparent 60%)"
      }}
    />
    <div
      className="absolute -inset-12 opacity-60 blur-3xl"
      style={{
        background: "radial-gradient(circle at bottom, rgba(37,99,235,0.25), transparent 60%)"
      }}
    />
    <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-white/10 via-white/5 to-transparent opacity-80" />
    <div className="absolute inset-[1px] rounded-[35px] bg-gradient-to-br from-[#070010]/95 via-[#0e0017]/90 to-[#05000c]/95 border border-white/10 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
      <div
        className="absolute inset-0 rounded-[34px] opacity-90"
        style={{
          background: "radial-gradient(circle at top, rgba(59,130,246,0.2), transparent 60%)"
        }}
      />
      <div
        className="absolute inset-0 rounded-[34px] opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }}
      />
      <div className="absolute inset-0 rounded-[34px] overflow-hidden">
        <div className="absolute -top-1/2 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-500/12 via-blue-500/10 to-transparent animate-scanline" />
        <div className="absolute top-0 -left-full h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-20 animate-[shine_6s_ease-in-out_infinite]" />
      </div>

      <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-[0.6rem] uppercase tracking-[0.35em] text-gray-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500/90 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
          <span>System Online</span>
        </div>
        <span className="text-blue-300/80">IT Core</span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[82%] sm:w-[78%] h-[60%] translate-y-2">
          <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/15 via-white/5 to-white/10 p-[1px]">
            <div className="absolute inset-[1px] rounded-[23px] bg-gradient-to-br from-[#0b1326]/95 via-[#0c1a2d]/90 to-[#0a101f]/95 border border-white/10 shadow-[0_18px_45px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-0 rounded-[23px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_65%)]" />
              <div className="absolute top-3 left-4 right-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400/80" />
                <span className="w-2 h-2 rounded-full bg-blue-500/60" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="ml-auto text-[0.55rem] uppercase tracking-[0.2em] text-blue-300/70">console</span>
              </div>

              <div className="absolute left-4 right-4 top-10 grid grid-cols-[1.2fr_0.8fr] gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[0.55rem] text-gray-400">
                    <Code2 className="w-3 h-3 text-blue-300" />
                    <span>build /app</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-blue-400/70 to-transparent animate-pulse" />
                    <div className="h-2 w-3/5 rounded-full bg-gradient-to-r from-blue-500/60 to-transparent" />
                    <div className="h-2 w-5/6 rounded-full bg-gradient-to-r from-blue-400/50 to-transparent" />
                    <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-blue-500/40 to-transparent" />
                    <div className="h-2 w-1/2 rounded-full bg-gradient-to-r from-blue-400/40 to-transparent" />
                  </div>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-3 backdrop-blur">
                  <div className="flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.2em] text-gray-400">
                    <Cpu className="w-3 h-3 text-blue-300" />
                    <span>runtime</span>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-blue-400/80 to-blue-500/30 animate-pulse" />
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-500/70 to-blue-400/30" />
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-blue-400/60 to-blue-500/20" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[0.55rem] text-gray-400">
                <span className="text-blue-300/70">build ok</span>
                <span>latency 12ms</span>
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 -bottom-[18%] w-[118%] h-[24%] rounded-[26px] bg-gradient-to-b from-[#0a1326]/90 to-[#0a0f1f]/85 border border-white/10 shadow-[0_14px_30px_rgba(0,0,0,0.6)]">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-2 rounded-full bg-white/10" />
            <div className="absolute bottom-2 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 space-y-2">
        <div className="h-1.5 w-2/3 rounded-full bg-gradient-to-r from-blue-500/70 to-transparent" />
        <div className="h-1.5 w-1/2 rounded-full bg-gradient-to-r from-blue-600/60 to-transparent" />
        <div className="h-1.5 w-3/4 rounded-full bg-gradient-to-r from-blue-400/40 to-transparent" />
      </div>

      <div className="absolute left-5 top-16 hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-[0.65rem] text-gray-300 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.35)] animate-float">
        <Terminal className="w-4 h-4 text-blue-300" />
        <span>CLI Shell</span>
      </div>
      <div className="absolute right-5 top-16 hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-[0.65rem] text-gray-300 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.35)] animate-float-delayed">
        <CloudDownload className="w-4 h-4 text-blue-400" />
        <span>Cloud Sync</span>
      </div>
      <div className="absolute left-8 bottom-16 hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-[0.65rem] text-gray-300 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.35)] animate-float-delayed">
        <Server className="w-4 h-4 text-blue-300" />
        <span>Server Node</span>
      </div>
      <div className="absolute right-8 bottom-16 hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-[0.65rem] text-gray-300 backdrop-blur-xl shadow-[0_10px_25px_rgba(0,0,0,0.35)] animate-float">
        <ShieldCheck className="w-4 h-4 text-blue-400" />
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

  // Profile data from database
  const [profileData, setProfileData] = useState({
    title: "Simple-stack Developer",
    subtitle: ["Web Developer", "UI/UX Design", "Mobile Developer", "Tech Enthusiast"],
    tech_stack: ["React", "JavaScript", "Node.js", "Python", "Tailwind", "Next.js", "MongoDB", "Express"],
    social_links: [
      { icon: Github, link: "https://github.com/achsan490" },
      { icon: Linkedin, link: "https://www.linkedin.com/in/san-project-41a03029b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
      { icon: Instagram, link: "https://www.instagram.com/sannn.io" },
      { icon: MessageCircle, link: "https://wa.me/6283839976681?text=Halo%20Achsanul!%20Saya%20melihat%20portofolio%20Anda%20dan%20tertarik%20untuk%20berdiskusi." }
    ]
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!supabase) return;

      try {
        const { data, error } = await supabase
          .from('profile_settings')
          .select('*')
          .single();

        if (data) {
          // Parse subtitle into array if it's a string
          let subtitleArray = ["Web Developer", "UI/UX Design", "Mobile Developer", "Tech Enthusiast"];
          if (data.subtitle) {
            // If subtitle contains separator, split it
            if (data.subtitle.includes('|')) {
              subtitleArray = data.subtitle.split('|').map(s => s.trim());
            } else {
              subtitleArray = [data.subtitle, "Tech Enthusiast"];
            }
          }

          setProfileData({
            title: data.title || "Simple-Stack Developer",
            subtitle: subtitleArray,
            tech_stack: data.tech_stack || ["React", "JavaScript", "Node.js", "Python", "Tailwind", "Next.js", "MongoDB", "Express"],
            social_links: [
              { icon: Github, link: data.github_url || "https://github.com/achsan490" },
              { icon: Linkedin, link: data.linkedin_url || "#" },
              { icon: Instagram, link: data.instagram_url || "#" }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Optimize AOS initialization
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

  // Optimize typing effect
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
    <div className="min-h-screen bg-[#020617] overflow-hidden px-[5%] sm:px-[5%] lg:px-[10%] pt-32 sm:pt-20 md:pt-0" id="Home">
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <div className="container mx-auto min-h-screen">
          <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen md:justify-between gap-8 sm:gap-12 lg:gap-20">
            {/* Left Column */}
            <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8 text-left lg:text-left order-1 lg:order-1 lg:mt-0"
              data-aos="fade-right"
              data-aos-delay="200">
              <div className="space-y-4 sm:space-y-6">
                <MainTitle title={profileData.title} />

                {/* Typing Effect */}
                <div className="h-8 flex items-center" data-aos="fade-up" data-aos-delay="800">
                  <span className="text-xl md:text-2xl bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent font-light">
                    {text}
                  </span>
                  <span className="w-[3px] h-6 bg-gradient-to-t from-[#3b82f6] to-[#60a5fa] ml-1 animate-blink"></span>
                </div>

                {/* Description */}
                <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed font-light"
                  data-aos="fade-up"
                  data-aos-delay="1000">
                  A passionate simple-stack developer with expertise in building modern, scalable web applications. I specialize in creating seamless user experiences through clean code and innovative solutions. With a strong foundation in both frontend and backend technologies, I transform ideas into powerful digital products that make a difference.
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-3 justify-start" data-aos="fade-up" data-aos-delay="1200">
                  {profileData.tech_stack.map((tech, index) => (
                    <TechStack key={index} tech={tech} />
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-row gap-3 w-full justify-start" data-aos="fade-up" data-aos-delay="1400">
                  <CTAButton href="#Portofolio" text="Projects" icon={ExternalLink} />
                  <CTAButton href="#Contact" text="Contact" icon={Mail} />
                </div>

                {/* Social Links */}
                <div className="flex gap-2 justify-start" data-aos="fade-up" data-aos-delay="1600">
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
