import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, PlusCircle } from "lucide-react";
import Navbar from "../components/Navbar";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    total_seats: "",
    price: "",
    img: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const secret = import.meta.env.VITE_ADMIN_SECRET || "adminsecretkey369";
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/events/admin`, form, {
        headers: { "x-admin-secret": secret },
      });

      if (res.data.success) {
        navigate("/admin");
      } else {
        setError(res.data.message || "Failed to create event");
      }
    } catch (err) {
      console.error("Error creating event:", err);
      setError(err.response?.data?.message || "Failed to create event. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-purple-500 selection:text-white pb-20">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-10">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Dashboard</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900 p-8 rounded-3xl border border-purple-900/50 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-purple-950 flex items-center justify-center text-purple-400 border border-purple-800/60">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Create New Event</h2>
              <p className="text-xs text-gray-400">Add a new summit, concert, or conference to the live directory.</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-300 uppercase tracking-wider">Event Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. AI Innovation Summit 2026"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-purple-900/50 focus:border-purple-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-300 uppercase tracking-wider">Description</label>
              <textarea
                name="description"
                rows={3}
                placeholder="Describe key speakers, agenda, topics..."
                value={form.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-purple-900/50 focus:border-purple-500 outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-300 uppercase tracking-wider">Venue Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. San Francisco, CA"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-purple-900/50 focus:border-purple-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-300 uppercase tracking-wider">Event Date & Time</label>
                <input
                  type="datetime-local"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-purple-900/50 focus:border-purple-500 outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-300 uppercase tracking-wider">Total Seats</label>
                <input
                  type="number"
                  name="total_seats"
                  min="1"
                  placeholder="e.g. 250"
                  value={form.total_seats}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-purple-900/50 focus:border-purple-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-semibold text-gray-300 uppercase tracking-wider">Base Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 1499.00"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-purple-900/50 focus:border-purple-500 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-300 uppercase tracking-wider">Cover Image URL</label>
              <input
                type="url"
                name="img"
                placeholder="https://images.unsplash.com/..."
                value={form.img}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-purple-900/50 focus:border-purple-500 outline-none text-sm"
              />
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all"
              >
                {loading ? "Publishing Event..." : "Publish Event to Directory"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateEventPage;
