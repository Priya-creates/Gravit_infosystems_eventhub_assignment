import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Calendar,
  Ticket,
  DollarSign,
  Users,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle,
  XCircle,
  RefreshCw,
  Radio,
  FileSpreadsheet,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { socket } from "../utils/socket";

const AdminEventsPage = () => {
  const [activeTab, setActiveTab] = useState("events"); // 'events' | 'bookings'
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingStats, setBookingStats] = useState({ totalRevenue: "0.00", totalTicketsSold: 0 });
  const [loading, setLoading] = useState(true);
  const [bookingSearch, setBookingSearch] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const adminSecret = import.meta.env.VITE_ADMIN_SECRET || "adminsecretkey369";
  const adminHeaders = {
    headers: { "x-admin-secret": adminSecret },
  };

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/events`);
      if (res.data.success) setEvents(res.data.events);
      else setEvents([]);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    }
  };

  // Fetch all bookings (Track Bookings)
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/admin/all`, adminHeaders);
      if (res.data.success) {
        setBookings(res.data.bookings || []);
        if (res.data.stats) {
          setBookingStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([fetchEvents(), fetchBookings()]);
      setLoading(false);
    };
    loadAllData();
  }, []);

  // Socket.IO real-time updates for Admin
  useEffect(() => {
    const handleSeatUpdate = (data) => {
      setEvents((prev) =>
        prev.map((e) =>
          Number(e.id) === Number(data.eventId) ? { ...e, available_seats: data.available_seats } : e
        )
      );
    };

    const handleNewBooking = (data) => {
      console.log("Admin: New booking incoming in real-time:", data);
      fetchBookings(); // Refresh bookings table and revenue stats
    };

    socket.on("seat_updated", handleSeatUpdate);
    socket.on("new_booking_created", handleNewBooking);

    return () => {
      socket.off("seat_updated", handleSeatUpdate);
      socket.off("new_booking_created", handleNewBooking);
    };
  }, []);

  // Delete event
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/events/admin/${id}`, adminHeaders);
      setEvents((prev) => prev.filter((event) => event.id !== id));
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event. Make sure admin secret is valid.");
    }
  };

  // Cancel booking & restore seats
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking and restore the seats?")) return;
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bookings/admin/${bookingId}/cancel`,
        {},
        adminHeaders
      );
      if (res.data.success) {
        fetchBookings();
        fetchEvents();
      }
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      alert("Failed to cancel booking.");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const term = bookingSearch.toLowerCase();
    return (
      b.name?.toLowerCase().includes(term) ||
      b.email?.toLowerCase().includes(term) ||
      b.event_title?.toLowerCase().includes(term) ||
      String(b.id).includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-purple-500 selection:text-white pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 text-purple-300 text-xs font-semibold mb-2 border border-purple-500/30">
              <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
              <span>ADMINISTRATIVE PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Event & Booking <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Dashboard</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchEvents();
                fetchBookings();
              }}
              className="p-2.5 rounded-xl bg-gray-900 border border-purple-900/50 hover:border-purple-500/60 transition-colors text-gray-300"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link to="/admin/event/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Event</span>
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Analytics Stats Overview Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/70 border border-purple-900/40 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
              <span>Total Events</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{events.length}</div>
            <div className="text-[11px] text-gray-500 mt-1">Live active summits</div>
          </div>

          <div className="bg-gray-900/70 border border-purple-900/40 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
              <span>Total Bookings</span>
              <Ticket className="w-4 h-4 text-pink-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{bookings.length}</div>
            <div className="text-[11px] text-gray-500 mt-1">Confirmed & pending</div>
          </div>

          <div className="bg-gray-900/70 border border-purple-900/40 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
              <span>Tickets Sold</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">{bookingStats.totalTicketsSold}</div>
            <div className="text-[11px] text-gray-500 mt-1">Seats reserved</div>
          </div>

          <div className="bg-gray-900/70 border border-purple-900/40 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300">₹{bookingStats.totalRevenue}</div>
            <div className="text-[11px] text-gray-500 mt-1">Gross sales recorded</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-2">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "events"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-gray-400 hover:text-white hover:bg-gray-900"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Event Management ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === "bookings"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-gray-400 hover:text-white hover:bg-gray-900"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Track Bookings ({bookings.length})</span>
          </button>
        </div>

        {/* Tab 1: Event Management */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900 rounded-3xl border border-purple-900/40 p-5 flex flex-col justify-between hover:border-purple-500/60 hover:shadow-xl transition-all"
                >
                  <div>
                    <div className="h-44 w-full mb-4 rounded-2xl overflow-hidden bg-gray-950">
                      <img
                        src={event.img || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold text-white line-clamp-1">{event.title}</h3>
                      <span className="text-xs font-bold text-purple-400">₹{event.price}</span>
                    </div>
                    <p className="text-xs text-gray-400">{event.location}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </p>

                    <div className="mt-4 pt-3 border-t border-gray-800 text-xs flex justify-between">
                      <span className="text-gray-400">Available Seats:</span>
                      <span
                        className={`font-bold ${
                          event.available_seats > 5 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {event.available_seats} / {event.total_seats}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-5 pt-3 border-t border-gray-800">
                    <Link to={`/admin/event/update/${event.id}`} className="flex-1">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-purple-300 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </motion.button>
                    </Link>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setEventToDelete(event);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 rounded-xl bg-red-950/60 hover:bg-red-900/80 border border-red-500/30 text-red-300 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-gray-900/40 rounded-3xl border border-purple-900/30">
                <p className="text-gray-400">No events found in database.</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Track Bookings */}
        {activeTab === "bookings" && (
          <div className="bg-gray-900 rounded-3xl border border-purple-900/40 overflow-hidden shadow-2xl">
            {/* Search filter for bookings */}
            <div className="p-4 sm:p-6 border-b border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by customer name, email or summit..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-950 border border-purple-900/40 text-xs text-white focus:border-purple-500 outline-none"
                />
              </div>
              <div className="text-xs text-gray-400">
                Showing {filteredBookings.length} of {bookings.length} reservations
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-950/80 text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">ID</th>
                    <th className="py-3.5 px-4 font-semibold">Customer</th>
                    <th className="py-3.5 px-4 font-semibold">Event</th>
                    <th className="py-3.5 px-4 font-semibold">Tier</th>
                    <th className="py-3.5 px-4 font-semibold">Tickets</th>
                    <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                    <th className="py-3.5 px-4 font-semibold">Date</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-800/40 transition-colors">
                        <td className="py-4 px-4 font-mono text-purple-300 font-bold">#{b.id}</td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">{b.name}</div>
                          <div className="text-[11px] text-gray-400">{b.email}</div>
                          <div className="text-[10px] text-gray-500">{b.mobile}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-purple-300 line-clamp-1">{b.event_title}</div>
                          <div className="text-[11px] text-gray-400">{b.event_location}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/50 text-[10px] font-semibold">
                            {b.ticket_category || "Standard"}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-bold text-white">{b.quantity}</td>
                        <td className="py-4 px-4 font-bold text-emerald-400">₹{b.total_amount}</td>
                        <td className="py-4 px-4 text-gray-400">
                          {b.booking_date
                            ? new Date(b.booking_date).toLocaleDateString(undefined, {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
                            : "-"}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              b.status === "confirmed"
                                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                                : "bg-red-950/80 text-red-300 border border-red-500/30"
                            }`}
                          >
                            {b.status === "confirmed" ? (
                              <CheckCircle className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-400" />
                            )}
                            <span className="capitalize">{b.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {b.status === "confirmed" && (
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              className="text-xs text-red-400 hover:text-red-300 font-semibold underline"
                            >
                              Cancel & Restore
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400">
                        No bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && eventToDelete && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className="bg-gray-900 rounded-3xl p-6 sm:p-8 w-full max-w-md border border-purple-600/50 shadow-2xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Delete Event Permanently?</h2>
                <p className="text-sm text-gray-400 mb-6">
                  Are you sure you want to delete <strong className="text-purple-300">{eventToDelete.title}</strong>? All
                  associated bookings will also be removed.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm font-semibold text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(eventToDelete.id)}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold text-white shadow-lg shadow-red-600/30"
                  >
                    Yes, Delete Event
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminEventsPage;
