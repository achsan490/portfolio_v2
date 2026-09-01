import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  ArrowLeft, 
  Compass, 
  Terminal, 
  Sparkles, 
  Briefcase, 
  User, 
  Mail, 
  SearchX,
  ShieldAlert
} from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const quickLinks = [
    { label: 'Lihat Portfolio', path: '/#Portofolio', icon: Briefcase },
    { label: 'Tentang Saya', path: '/#About', icon: User },
    { label: 'Hubungi Saya', path: '/#Contact', icon: Mail },
  ];

  return (
    <div className="relative min-h-screen bg-[#030305] text-white flex items-center justify-center px-4 py-12 overflow-hidden selection:bg-white/20 selection:text-white">
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-zinc-700/20 via-zinc-500/10 to-transparent rounded-full blur-[140px] opacity-60 animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-zinc-800/15 rounded-full blur-[120px] opacity-40" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-zinc-700/15 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Top Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-6"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-400 to-white rounded-full blur-md opacity-20 group-hover:opacity-40 transition duration-700" />
            <div className="relative px-4 py-1.5 rounded-full bg-[#0a0a0f]/90 backdrop-blur-xl border border-white/10 flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 text-transparent bg-clip-text text-xs font-mono uppercase tracking-widest">
                SYSTEM ERROR // HTTP 404
              </span>
            </div>
          </div>
        </motion.div>

        {/* Big 404 Visual Hero with Side-by-Side Icon Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative mb-5 select-none flex items-center justify-center gap-3 sm:gap-4"
        >
          {/* 404 Number (Scaled Down) */}
          <div className="relative inline-block">
            {/* Background 404 Shadow Glow */}
            <span className="absolute inset-0 text-5xl sm:text-7xl font-black font-mono tracking-tight text-white/5 blur-xl">
              404
            </span>
            <h1 className="text-5xl sm:text-7xl font-black font-mono tracking-tight bg-gradient-to-b from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent drop-shadow-xl">
              404
            </h1>
          </div>

          {/* Compact Radar Scanner Icon Badge */}
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-zinc-500/20 to-white/20 rounded-2xl blur-md opacity-40 animate-pulse" />
            <motion.div
              animate={{
                y: [-3, 3, -3],
                rotate: [0, 3, -3, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-[#0a0a0f]/90 backdrop-blur-2xl border border-white/15 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center"
            >
              <SearchX className="w-5 h-5 sm:w-7 sm:h-7 text-zinc-200 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            </motion.div>
          </div>
        </motion.div>

        {/* Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-sans">
            Oops! Halaman Tidak Ditemukan
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Halaman yang Anda tuju mungkin telah dipindahkan, berganti tautan, atau sedang tersesat di ruang hampa digital.
          </p>
        </motion.div>

        {/* Interactive Cyber Terminal Snippet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 mx-auto max-w-lg text-left rounded-xl bg-white/[0.02] backdrop-blur-md border border-white/[0.08] p-3.5 sm:p-4 text-xs font-mono text-zinc-400 shadow-inner"
        >
          <div className="flex items-center gap-1.5 pb-2.5 mb-2.5 border-b border-white/[0.06] text-zinc-500 text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>CONSOLE LOG // DIAGNOSTICS</span>
            <div className="ml-auto flex gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500/80" />
              <span className="w-2 h-2 rounded-full bg-amber-500/80" />
              <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
            </div>
          </div>
          <div className="space-y-1 text-zinc-400">
            <p><span className="text-rose-400">Error 404:</span> Route path is not registered in this cluster.</p>
            <p><span className="text-zinc-500">&gt; location.pathname:</span> <span className="text-zinc-300">{window.location.pathname}</span></p>
            <p><span className="text-emerald-400">&gt; action_recommended:</span> Return to safe coordinates.</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8"
        >
          <button
            onClick={handleGoHome}
            className="w-full sm:w-auto relative group overflow-hidden px-6 py-3 rounded-xl bg-gradient-to-r from-white via-zinc-200 to-zinc-300 text-black font-semibold text-sm shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(255,255,255,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-black" />
            <span>Kembali ke Beranda</span>
          </button>

          <button
            onClick={handleGoBack}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300 text-sm font-medium backdrop-blur-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Halaman Sebelumnya</span>
          </button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-6 border-t border-white/[0.06]"
        >
          <p className="text-xs uppercase tracking-wider text-zinc-500 font-mono mb-3">
            Atau jelajahi menu berikut:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {quickLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a
                  key={idx}
                  href={item.path}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.07] border border-white/[0.06] hover:border-white/15 text-xs text-zinc-400 hover:text-zinc-200 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Footer Credit */}
        <div className="mt-12 text-[11px] text-zinc-600 font-mono">
          © 2026 sanproject™ • All Rights Reserved
        </div>
      </div>
    </div>
  );
}
