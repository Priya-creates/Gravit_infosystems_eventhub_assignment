import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  User,
  Mail,
  Phone,
  ShieldCheck,
  AlertCircle,
  XCircle,
  ArrowLeft,
  Sparkles,
  Lock,
} from "lucide-react";
import Navbar from "../components/Navbar";

const BookTicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const ticketCategory = searchParams.get("category") || "Standard Pass";
  const unitPrice = Number(searchParams.get("price")) || 0;

  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    quantity: 1,
  });

  const [loading, setLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  // Fetch event details to verify seat availability
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events/${id}`);
        if (res.data.success) {
          setEvent(res.data.event);
        }
      } catch (err) {
        console.error("Failed to load event for checkout:", err);
      }
    };
    fetchEvent();
  }, [id]);

  const effectiveUnitPrice = unitPrice > 0 ? unitPrice : event ? Number(event.price) : 0;
  const totalAmount = (effectiveUnitPrice * form.quantity).toFixed(2);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleQuantity = (delta) => {
    const nextVal = Math.max(1, form.quantity + delta);
    if (event && nextVal > event.available_seats) {
      setBookingError(`Only ${event.available_seats} seats are currently available!`);
      return;
    }
    setForm({ ...form, quantity: nextVal });
    setBookingError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingError(null);

    if (event && form.quantity > event.available_seats) {
      setBookingError(`Cannot book ${form.quantity} tickets. Only ${event.available_seats} seats remaining.`);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/bookings`,
        {
          event_id: id,
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          quantity: Number(form.quantity),
          ticket_category: ticketCategory,
          unit_price: effectiveUnitPrice,
        }
      );

      if (res.data.success) {
        navigate(`/booking-success/${res.data.bookingId}`);
      } else {
        setBookingError(res.data.message || "Booking reservation failed.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      const msg = err.response?.data?.message || "Booking failed due to high server traffic. Please try again.";
      setBookingError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-purple-500 selection:text-white pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to={`/event/${id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Details</span>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left: Animated Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-3 bg-gray-900 rounded-3xl p-6 sm:p-8 border border-purple-900/40 shadow-2xl relative"
          >
            <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Lock className="w-4 h-4" />
              <span>Encrypted Seat Reservation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Complete Checkout</h1>
            <p className="text-xs sm:text-sm text-gray-400 mb-6">
              Enter attendee details below. Your ticket pass with QR code will be generated immediately.
            </p>

            {/* Booking Failure Animation Banner */}
            <AnimatePresence>
              {bookingError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    x: [0, -6, 6, -4, 4, 0], // Shake animation on failure
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="mb-6 p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 flex items-start gap-3 shadow-lg"
                >
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-bold text-red-300">Reservation Failed</div>
                    <div className="text-xs text-red-200 mt-0.5">{bookingError}</div>
                  </div>
                  <button
                    onClick={() => setBookingError(null)}
                    className="text-red-400 hover:text-red-200 text-xs font-semibold"
                  >
                    Dismiss
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Alex Mercer"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-950 border border-purple-900/50 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="alex@company.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-950 border border-purple-900/50 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="mobile"
                    required
                    placeholder="+91-9876543210"
                    value={form.mobile}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-950 border border-purple-900/50 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* Quantity Counter */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                  Number of Passes
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleQuantity(-1)}
                    className="w-10 h-10 rounded-xl bg-gray-950 border border-purple-900/60 flex items-center justify-center text-lg font-bold hover:border-purple-500 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-14 text-center font-bold text-lg">{form.quantity}</span>
                  <button
                    type="button"
                    onClick={() => handleQuantity(1)}
                    className="w-10 h-10 rounded-xl bg-gray-950 border border-purple-900/60 flex items-center justify-center text-lg font-bold hover:border-purple-500 transition-colors"
                  >
                    +
                  </button>
                  <span className="text-xs text-gray-400">
                    {event ? `(${event.available_seats} seats remaining)` : ""}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      <span>Locking In Seats...</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-5 h-5" />
                      <span>Confirm & Generate Pass (₹{totalAmount})</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Right: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="bg-gray-900 rounded-3xl p-6 border border-purple-900/40 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>

              {event && (
                <div className="mb-4 pb-4 border-b border-gray-800">
                  <div className="text-sm font-semibold text-purple-300">{event.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{event.location}</div>
                  <div className="text-xs text-pink-400 mt-0.5">
                    {new Date(event.date).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </div>
                </div>
              )}

              <div className="space-y-2.5 text-xs text-gray-300">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ticket Tier:</span>
                  <span className="font-semibold text-white">{ticketCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Unit Price:</span>
                  <span className="font-semibold text-white">₹{effectiveUnitPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Quantity:</span>
                  <span className="font-semibold text-white">{form.quantity}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-800 text-sm">
                  <span className="font-bold text-white">Total Amount:</span>
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-[11px] text-gray-400 space-y-1.5">
                <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Guaranteed Verification</span>
                </div>
                <p>QR code pass is instantly verifiable at the entrance gate.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookTicketPage;
