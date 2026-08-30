import React, { useState, useEffect } from "react";
import { Share2, User, Mail, MessageSquare, Send, Phone } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Komentar from "../components/Commentar";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Swal.fire({
      title: 'Mengirim Pesan...',
      html: 'Harap tunggu selagi kami mengirim pesan Anda',
      allowOutsideClick: false,
      background: '#0a0a0f',
      color: '#ffffff',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const formData = new FormData(e.target);
      const response = await fetch('https://formspree.io/f/xvgrdbjo', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Pesan Anda telah berhasil terkirim!',
          icon: 'success',
          background: '#0a0a0f',
          color: '#ffffff',
          confirmButtonColor: '#ffffff',
          confirmButtonText: '<span style="color:#000000; font-weight:bold">OK</span>',
          timer: 2500,
          timerProgressBar: true
        });
        e.target.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan. Silakan coba lagi nanti.',
        icon: 'error',
        background: '#0a0a0f',
        color: '#ffffff',
        confirmButtonColor: '#ffffff',
        confirmButtonText: '<span style="color:#000000; font-weight:bold">OK</span>',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-[5%] sm:px-[5%] lg:px-[10%] pb-20">
      <div className="text-center lg:mt-[5%] mt-10 mb-6 sm:px-0 px-[5%]">
        <h2
          data-aos="fade-down"
          data-aos-duration="1000"
          className="inline-block text-3xl md:text-5xl font-extrabold tracking-tight text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400"
          style={{ fontFamily: "'Space Grotesk', 'Poppins', sans-serif" }}
        >
          Hubungi Saya
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base mt-2 font-light"
        >
          Punya pertanyaan atau ingin berkolaborasi? Kirimi saya pesan dan mari berdiskusi.
        </p>
      </div>

      <div
        className="h-auto py-6 flex items-center justify-center 2xl:pr-[3.1%] lg:pr-[3.8%] md:px-0"
        id="Contact"
      >
        <div className="container px-[1%] grid grid-cols-1 lg:grid-cols-[45%_55%] 2xl:grid-cols-[38%_62%] gap-8">
          {/* Contact Form Card */}
          <div
            className="bg-[#0a0a0f]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-1.5 text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', 'Poppins', sans-serif" }}>
                  Kirim Pesan
                </h2>
                <p className="text-zinc-400 text-xs sm:text-sm font-light">
                  Saya akan membalas pesan Anda secepat mungkin.
                </p>
              </div>
              <Share2 className="w-6 h-6 text-zinc-500" />
            </div>

            <form 
              action="https://formspree.io/f/xvgrdbjo"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div data-aos="fade-up" data-aos-delay="100" className="relative group">
                <User className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Nama Anda"
                  disabled={isSubmitting}
                  className="w-full p-3.5 pl-11 bg-white/[0.03] rounded-xl border border-white/10 placeholder-zinc-500 text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-300 disabled:opacity-50"
                  required
                />
              </div>
              <div data-aos="fade-up" data-aos-delay="200" className="relative group">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Anda"
                  disabled={isSubmitting}
                  className="w-full p-3.5 pl-11 bg-white/[0.03] rounded-xl border border-white/10 placeholder-zinc-500 text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-300 disabled:opacity-50"
                  required
                />
              </div>
              <div data-aos="fade-up" data-aos-delay="300" className="relative group">
                <Phone className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Nomor Telepon (WhatsApp)"
                  disabled={isSubmitting}
                  className="w-full p-3.5 pl-11 bg-white/[0.03] rounded-xl border border-white/10 placeholder-zinc-500 text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-300 disabled:opacity-50"
                  required
                />
              </div>
              <div data-aos="fade-up" data-aos-delay="400" className="relative group">
                <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                <textarea
                  name="message"
                  placeholder="Pesan Anda..."
                  disabled={isSubmitting}
                  className="w-full resize-none p-3.5 pl-11 bg-white/[0.03] rounded-xl border border-white/10 placeholder-zinc-500 text-white text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all duration-300 h-28 disabled:opacity-50"
                  required
                />
              </div>
              <button
                data-aos="fade-up"
                data-aos-delay="500"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-zinc-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10">
              <SocialLinks />
            </div>
          </div>

          {/* Comments Section */}
          <div className="h-full flex flex-col bg-[#0a0a0f]/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <Komentar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
