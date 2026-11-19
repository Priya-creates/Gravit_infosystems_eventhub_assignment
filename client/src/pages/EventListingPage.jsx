import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Search, MapPin, Radio, Sparkles, FilterX } from "lucide-react";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import { socket } from "../utils/socket";

const EventListingPage = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all events with active filters
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (location.trim()) params.location = location.trim();
        if (date) params.date = date;

        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events`, { params });
        if (res.data.success) {
          setEvents(res.data.events);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, location, date]);

  // Synchronize seat counts in real-time
  useEffect(() => {
    const handleSeatUpdate = (data) => {
      setEvents((prev) =>
        prev.map((ev) =>
          Number(ev.id) === Number(data.eventId)
            ? { ...ev, available_seats: data.available_seats }
            : ev
        )
      );
    };

    socket.on("seat_updated", handleSeatUpdate);
    return () => {
      socket.off("seat_updated", handleSeatUpdate);
    };
  }, []);

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setDate("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-purple-500 selection:text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
            <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
            <span>SOCKET.IO REAL-TIME SEAT MONITOR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Explore Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Events</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Browse through conferences, developer summits, and festivals. Seat counts update automatically in real-time.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-gray-900/80 p-4 sm:p-5 rounded-2xl border border-purple-900/40 shadow-xl mb-10 backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search event title or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950 border border-purple-900/50 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm transition-all"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter by city or country..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950 border border-purple-900/50 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm transition-all"
              />
            </div>

            {/* Date */}
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-purple-900/50 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm transition-all"
              />
            </div>
          </div>

          {(search || location || date) && (
            <div className="mt-3 pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs">
              <span className="text-gray-400">
                Active filters applied: {search && `"${search}"`} {location && `in ${location}`} {date && `on ${date}`}
              </span>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <Sparkles className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Syncing latest events...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-20 text-center bg-gray-900/40 rounded-3xl border border-purple-900/30">
            <p className="text-gray-400 text-base mb-4">No events found matching your search criteria.</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-500 transition-all text-sm shadow-lg shadow-purple-600/30"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListingPage;
