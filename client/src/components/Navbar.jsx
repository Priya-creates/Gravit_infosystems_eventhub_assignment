import React from "react";
import { Link, useLocation } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Sparkles, Calendar, ShieldCheck, Ticket } from "lucide-react";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/80 border-b border-purple-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
            <Ticket className="w-5 h-5 text-white transform -rotate-12" />
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              <span>Event</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Hub</span>
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-purple-300 font-semibold -mt-1">
              Smart Bookings
            </p>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-900/70 p-1.5 rounded-full border border-purple-900/50">
          <Link
            to="/"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              isActive("/")
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/40"
                : "text-gray-300 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            Home
          </Link>
          <Link
            to="/events"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              isActive("/events")
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/40"
                : "text-gray-300 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Explore Events
          </Link>
          <Link
            to="/admin"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
              location.pathname.startsWith("/admin")
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/40"
                : "text-gray-300 hover:text-white hover:bg-gray-800/60"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Dashboard
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Sync</span>
          </div>

          <Link to="/events">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all"
            >
              Book Tickets
            </motion.button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
