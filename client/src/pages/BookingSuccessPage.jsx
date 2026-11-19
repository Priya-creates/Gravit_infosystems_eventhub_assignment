import React, { useRef, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Confetti from "react-confetti";
import QRCode from "react-qr-code";
import { CheckCircle2, Download, ArrowRight, Calendar, MapPin } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";

const BookingSuccessPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const ticketUrl = `https://eventhub.com/ticket/${id}`;

  const qrRef = useRef(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${id}`);
        if (res.data.success) {
          setBooking(res.data.booking);
        }
      } catch (err) {
        console.warn("Could not fetch extended booking info:", err.message);
      }
    };
    fetchBookingDetails();
  }, [id]);

  const handleDownload = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Create a stylish ticket pass canvas
      const width = 420;
      const height = 560;
      canvas.width = width;
      canvas.height = height;

      // Dark futuristic ticket background
      ctx.fillStyle = "#0c0a17";
      ctx.fillRect(0, 0, width, height);

      // Top gradient banner
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, "#7c3aed");
      grad.addColorStop(1, "#ec4899");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, 8);

      // Outer border
      ctx.strokeStyle = "#4c1d95";
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, width - 2, height - 2);

      // Ticket Brand Header
      ctx.fillStyle = "#a855f7";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("EVENTHUB OFFICIAL TICKET PASS", width / 2, 45);

      // Summit Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 18px sans-serif";
      const title = booking?.event_title || "Summit Attendee Pass";
      ctx.fillText(title.length > 30 ? title.substring(0, 30) + "..." : title, width / 2, 80);

      // Venue & Date
      ctx.fillStyle = "#9ca3af";
      ctx.font = "12px sans-serif";
      const location = booking?.event_location || "Verified Venue";
      ctx.fillText(location, width / 2, 105);

      // White card background for QR Code
      const qrBoxSize = 220;
      const qrBoxX = (width - qrBoxSize) / 2;
      const qrBoxY = 135;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 16);
      ctx.fill();

      // Draw QR Code image in the center
      const qrOffset = 20;
      ctx.drawImage(img, qrBoxX + qrOffset, qrBoxY + qrOffset, qrBoxSize - qrOffset * 2, qrBoxSize - qrOffset * 2);

      // Attendee Info
      ctx.fillStyle = "#e9d5ff";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(`Pass #${id}  |  ${booking?.ticket_category || "Standard Pass"}`, width / 2, 395);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText(booking?.name ? `Attendee: ${booking.name}` : "Verified Ticket Holder", width / 2, 425);

      ctx.fillStyle = "#9ca3af";
      ctx.font = "12px sans-serif";
      ctx.fillText(`Quantity: ${booking?.quantity || 1} Pass(es)  ·  Status: Confirmed`, width / 2, 450);

      // Footer note
      ctx.fillStyle = "#6b7280";
      ctx.font = "11px sans-serif";
      ctx.fillText("Scan this pass at entrance gate for instant verification.", width / 2, 510);

      URL.revokeObjectURL(url);

      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `eventhub-pass-${id}.png`;
      downloadLink.click();
    };

    img.src = url;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-purple-500 selection:text-white pb-20 relative overflow-hidden">
      <Navbar />

      {/* Confetti Celebration */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={400}
        recycle={false}
        colors={["#a855f7", "#ec4899", "#6366f1", "#ffffff"]}
      />

      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[180px] rounded-full pointer-events-none" />

      <div className="max-w-2xl mx-auto px-4 pt-12 relative z-10 text-center">
        {/* Success Card */}
        <div className="bg-gray-900/90 border border-purple-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Badge */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-5 shadow-lg shadow-emerald-900/40">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Reservation Confirmed!
          </h1>
          <p className="text-sm text-gray-400 mb-6">
            Your ticket pass has been successfully generated and registered in the system.
          </p>

          <div className="bg-gray-950/80 rounded-2xl p-5 border border-purple-900/40 mb-6 text-left space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-800 text-xs">
              <span className="text-gray-400">Pass Reference:</span>
              <span className="font-mono font-bold text-purple-400">#{id}</span>
            </div>

            {booking && (
              <>
                <div className="text-sm font-bold text-white">{booking.event_title}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span>{booking.event_location}</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" />
                  <span>{new Date(booking.event_date).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-800 text-xs text-gray-300">
                  <span>Attendee: <strong>{booking.name}</strong></span>
                  <span>Category: <strong className="text-purple-300">{booking.ticket_category || "Standard"}</strong></span>
                </div>
              </>
            )}
          </div>

          {/* QR Code Container */}
          <div className="inline-block p-4 rounded-2xl bg-white shadow-xl shadow-purple-950/60 mb-6" ref={qrRef}>
            <QRCode id="ticket-qr" value={ticketUrl} size={170} />
          </div>

          <p className="text-xs text-gray-500 mb-6">
            Present this QR pass on your mobile device at the venue gate for priority check-in.
          </p>

          {/* Download & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleDownload}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG Ticket Pass</span>
            </button>

            <Link to="/events" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                <span>Browse More Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
