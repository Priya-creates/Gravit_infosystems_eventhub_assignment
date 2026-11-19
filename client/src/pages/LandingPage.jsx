import React, { useRef } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Calendar,
  Ticket,
  MapPin,
  QrCode,
  ShieldCheck,
  Zap,
  ArrowRight,
  Users,
  Award,
  Globe2,
  ChevronRight,
  Clock,
} from "lucide-react";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.2]);
  const floatY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const featuredHighlights = [
    {
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      title: "Real-Time Seat Locking",
      desc: "Live synchronized availability via Socket.IO. Never get double-booked.",
    },
    {
      icon: <QrCode className="w-6 h-6 text-pink-400" />,
      title: "Instant QR Pass",
      desc: "Download verified high-res QR code tickets instantly to your phone.",
    },
    {
      icon: <MapPin className="w-6 h-6 text-indigo-400" />,
      title: "Google Maps Nav",
      desc: "Integrated venue mapping with one-click navigation and directions.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Atomic Transactions",
      desc: "ACID-compliant MySQL seat reservation preventing over-allocations.",
    },
  ];

  const upcomingSummits = [
    {
      id: 1,
      title: "Global Tech Summit 2026",
      category: "Artificial Intelligence & Quantum",
      location: "San Francisco, CA, USA",
      date: "Dec 15, 2026",
      seats: 242,
      price: "₹1499",
      img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      title: "International Sound & Music Fest",
      category: "Electronic & Visual Arts",
      location: "Austin, TX, USA",
      date: "Nov 28, 2026",
      seats: 488,
      price: "₹899",
      img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
      title: "Design & Creative Flow Conference",
      category: "UI/UX & Web Typography",
      location: "Bengaluru, Karnataka, India",
      date: "Dec 05, 2026",
      seats: 165,
      price: "₹649",
      img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-950 text-white selection:bg-purple-500 selection:text-white overflow-hidden">
      <Navbar />

      {/* Hero Section with Parallax */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-10 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Futuristic glowing ambient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/25 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-pink-600/20 blur-[130px] rounded-full pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-5xl mx-auto text-center z-10"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/40 border border-purple-500/40 text-purple-300 text-xs sm:text-sm font-semibold mb-8 backdrop-blur-md shadow-lg shadow-purple-900/30"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
            <span>NEXT-GENERATION SUMMIT EXPERIENCE 2026</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            Where Innovators Gather to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              Shape Tomorrow.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Immerse yourself in world-class tech summits, design symposia, and live festivals.
            Enjoy instant ticket reservations, real-time seat tracking, and interactive venue maps.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/events" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(168, 85, 247, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 group transition-all"
              >
                <span>Browse Upcoming Summits</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <Link to="/admin" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gray-900/80 hover:bg-gray-800 text-gray-200 font-semibold text-base border border-purple-500/30 backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>Admin Management</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Quick Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-16 border-t border-purple-900/30 mt-16 max-w-4xl mx-auto"
          >
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-purple-300">50K+</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Verified Attendees</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-pink-300">120+</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Global Summits</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-300">99.9%</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">Real-time Sync</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-300">Instant</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">QR Pass Dispatch</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Brand Partners Marquee Strip */}
      <section className="py-6 border-y border-purple-900/30 bg-gray-900/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-gray-500 text-sm font-semibold tracking-wider uppercase">
          <span className="text-purple-400/80 flex items-center gap-1.5"><Globe2 className="w-4 h-4" /> Global Tech Co</span>
          <span>Flowz Summit</span>
          <span>HyperScale Labs</span>
          <span>NextVision AI</span>
          <span>CyberForge Cloud</span>
        </div>
      </section>

      {/* Parallax Features Showcase */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs uppercase font-extrabold tracking-widest text-purple-400 mb-2">
            Engineered For Excellence
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Next-Level Event Management Features
          </h2>
          <p className="text-gray-400 mt-3">
            Every booking is handled with millisecond-grade precision, live seat synchronization, and instant verification.
          </p>
        </div>

        <motion.div style={{ y: floatY }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHighlights.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)" }}
              className="bg-gray-900/70 border border-purple-900/50 p-6 rounded-2xl backdrop-blur-sm hover:border-purple-500/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-purple-400 gap-1">
                <span>Learn more</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Summits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-purple-400 mb-2">
              Curated Experiences
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">Featured Upcoming Summits</h2>
            <p className="text-gray-400 mt-2">Explore elite industry gatherings happening this season.</p>
          </div>
          <Link to="/events" className="mt-4 md:mt-0 flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-semibold text-sm">
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingSummits.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className="group bg-gray-900 rounded-3xl overflow-hidden border border-purple-900/40 hover:border-purple-500/70 hover:shadow-2xl hover:shadow-purple-600/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={event.img}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gray-950/70 backdrop-blur-md text-xs font-semibold text-purple-300 border border-purple-500/30">
                    {event.category}
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-purple-600 text-xs font-bold text-white shadow-lg">
                    {event.price}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-2 mt-4 text-sm text-gray-400">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span>{event.location}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-pink-400" />
                      <span>{event.date}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-400" />
                      <span>{event.seats} Seats Available</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link to={`/event/${event.id}`}>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View & Select Pass</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-gray-900 border border-purple-500/50 overflow-hidden shadow-2xl shadow-purple-900/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
              Reserve Your Place Among Industry Leaders.
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-8">
              Seats are limited and synchronized in real time. Secure your summit pass with instant QR ticket delivery today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/events">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-2xl bg-white text-gray-950 font-bold hover:bg-gray-100 transition-all shadow-xl"
                >
                  Explore All Events
                </motion.button>
              </Link>
              <Link to="/admin">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-2xl bg-purple-800/60 hover:bg-purple-700/60 border border-purple-400/40 text-white font-semibold transition-all"
                >
                  Host / Manage Event
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-900/30 bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
              EH
            </div>
            <span className="font-bold text-white">EventHub</span>
            <span>— Smart Event Booking System</span>
          </div>
          <div>
            Built with React, Tailwind CSS, Framer Motion & MySQL2.
          </div>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-purple-400">Home</Link>
            <Link to="/events" className="hover:text-purple-400">Events</Link>
            <Link to="/admin" className="hover:text-purple-400">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
