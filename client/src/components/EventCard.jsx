import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Users } from "lucide-react";

const EventCard = ({ event }) => {
  const isLowSeats = event.available_seats > 0 && event.available_seats <= 10;
  const isSoldOut = event.available_seats <= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-gray-900 rounded-3xl border border-purple-900/40 overflow-hidden hover:border-purple-500/70 hover:shadow-2xl hover:shadow-purple-600/30 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Image Container */}
        <div className="relative h-52 w-full overflow-hidden bg-gray-950">
          <img
            src={event.img || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80"}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />

          {/* Live Indicator Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-950/80 backdrop-blur-md text-[11px] font-semibold text-purple-300 border border-purple-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Available</span>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-3 right-3 px-3.5 py-1 rounded-full bg-purple-600 text-xs font-bold text-white shadow-lg shadow-purple-600/40">
            ₹{event.price}
          </div>
        </div>

        {/* Details */}
        <div className="p-5 text-gray-300">
          <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
            {event.title}
          </h3>

          <p className="mt-2 text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="mt-4 space-y-1.5 text-xs text-gray-400">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </p>
            <p className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
              <span>{new Date(event.date).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
            </p>
          </div>

          {/* Real-Time Seat Status Bar */}
          <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Seats Left:</span>
            </div>
            <span
              className={`font-black px-2 py-0.5 rounded-md ${
                isSoldOut
                  ? "bg-red-950/80 text-red-400 border border-red-500/30"
                  : isLowSeats
                  ? "bg-amber-950/80 text-amber-300 border border-amber-500/30 animate-pulse"
                  : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {isSoldOut ? "SOLD OUT" : `${event.available_seats} remaining`}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-5 pt-0">
        <Link to={`/event/${event.id}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSoldOut}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all ${
              isSoldOut
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30"
            }`}
          >
            {isSoldOut ? "Event Full" : "View Details & Book"}
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;
