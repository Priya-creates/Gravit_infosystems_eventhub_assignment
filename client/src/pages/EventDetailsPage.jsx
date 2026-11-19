import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  Tag,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { socket } from "../utils/socket";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTier, setSelectedTier] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events/${id}`);
        if (res.data.success && res.data.event) {
          setEvent(res.data.event);
          // Set default tier to Standard or first tier
          const tiers = res.data.event.ticket_tiers || [];
          setSelectedTier(tiers.find((t) => t.id === "standard") || tiers[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to fetch event details. Please verify the event ID.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  // Real-time seat updates via Socket.IO
  useEffect(() => {
    const handleSeatUpdate = (data) => {
      if (Number(data.eventId) === Number(id)) {
        setEvent((prev) => (prev ? { ...prev, available_seats: data.available_seats } : prev));
      }
    };

    socket.on("seat_updated", handleSeatUpdate);
    return () => {
      socket.off("seat_updated", handleSeatUpdate);
    };
  }, [id]);

  const handleProceedToBook = () => {
    if (!event) return;
    const categoryName = selectedTier?.name || "Standard";
    const categoryPrice = selectedTier?.price || event.price;
    navigate(`/booking/${event.id}?category=${encodeURIComponent(categoryName)}&price=${categoryPrice}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <Sparkles className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-400">Loading summit details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
        <Navbar />
        <div className="bg-gray-900 border border-red-500/40 p-8 rounded-3xl max-w-md text-center shadow-xl">
          <p className="text-red-400 font-semibold mb-4">{error || "Event not found"}</p>
          <Link to="/events" className="px-5 py-2.5 bg-purple-600 text-white font-semibold rounded-xl inline-block">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isSoldOut = event.available_seats <= 0;
  const tiers = event.ticket_tiers || [
    {
      id: "standard",
      name: "Standard Pass",
      price: event.price,
      description: "Full regular event access.",
      perks: ["General entry", "Standard seating"],
    },
  ];

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-purple-500 selection:text-white pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Navigation Breadcrumb */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Directory</span>
        </Link>

        {/* Hero Card */}
        <div className="relative rounded-3xl overflow-hidden border border-purple-900/40 bg-gray-900 shadow-2xl">
          <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-gray-950">
            <img
              src={event.img || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-950/80 backdrop-blur-md text-xs font-semibold text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Live Seat Monitoring</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-2 drop-shadow-lg">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-300">
                <span className="flex items-center gap-1.5 bg-gray-900/70 px-3 py-1 rounded-full border border-purple-800/40">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  {event.location}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-900/70 px-3 py-1 rounded-full border border-pink-800/40">
                  <Calendar className="w-4 h-4 text-pink-400" />
                  {new Date(event.date).toLocaleDateString(undefined, { dateStyle: "full" })}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-900/70 px-3 py-1 rounded-full border border-indigo-800/40">
                  <Users className="w-4 h-4 text-indigo-400" />
                  {event.available_seats} of {event.total_seats} Seats Available
                </span>
              </div>
            </div>
          </div>

          {/* Description & Details */}
          <div className="p-6 sm:p-10 space-y-10">
            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                About This Summit
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Ticket Categories with Dynamic Pricing */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-pink-400" />
                    Ticket Categories & Dynamic Pricing
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    Select your preferred access tier. Prices calculate automatically based on summit privileges.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tiers.map((tier) => {
                  const isSelected = selectedTier?.id === tier.id;
                  return (
                    <motion.div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative cursor-pointer rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-purple-950/40 border-purple-500 shadow-xl shadow-purple-600/20"
                          : "bg-gray-950/60 border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-purple-400">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}

                      <div>
                        <div className="text-base font-bold text-white">{tier.name}</div>
                        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-1">
                          ₹{tier.price}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{tier.description}</p>

                        <div className="mt-4 pt-3 border-t border-gray-800/80 space-y-2">
                          {tier.perks?.map((perk, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                              <span>{perk}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 pt-3">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full block text-center ${
                            isSelected ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {isSelected ? "Selected Tier" : "Select Tier"}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Google Maps Integration */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  Venue Location (Google Maps)
                </h2>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <span>Get Driving Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="rounded-2xl overflow-hidden border border-purple-900/40 bg-gray-950 h-64 sm:h-80 shadow-lg">
                <iframe
                  title="Event Venue Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                  loading="lazy"
                  allowFullScreen
                  src={mapUrl}
                ></iframe>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Official venue verified: {event.location}
              </p>
            </div>

            {/* Floating / Sticky Booking CTA Strip */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/80 via-gray-900 to-indigo-950/80 border border-purple-600/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
              <div>
                <div className="text-xs text-purple-300 font-semibold uppercase tracking-wider">
                  Selected: {selectedTier?.name || "Standard Pass"}
                </div>
                <div className="text-3xl font-black text-white flex items-baseline gap-2">
                  <span>₹{selectedTier?.price || event.price}</span>
                  <span className="text-xs text-gray-400 font-normal">/ attendee</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {event.available_seats} seats remaining &middot; Instant QR ticket delivery
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSoldOut}
                onClick={handleProceedToBook}
                className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-base transition-all shadow-xl flex items-center justify-center gap-2 ${
                  isSoldOut
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/40"
                }`}
              >
                <Zap className="w-5 h-5" />
                <span>{isSoldOut ? "Summit Sold Out" : "Book Selected Pass"}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
