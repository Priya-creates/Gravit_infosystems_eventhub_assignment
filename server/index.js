const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const eventsRouter = require("./routes/eventRoutes");
const bookingsRouter = require("./routes/bookingRoutes");

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Socket client disconnected:", socket.id);
  });
});

// Make io accessible across routes/controllers
app.set("io", io);

app.use(cors());
app.use(express.json());

// Routes mounted on both /api and root paths for maximum compatibility
app.use("/api/events", eventsRouter);
app.use("/events", eventsRouter);

app.use("/api/bookings", bookingsRouter);
app.use("/bookings", bookingsRouter);

// Health check
app.get("/", (req, res) => res.json({ ok: true, msg: "Smart Event Booking Backend with Socket.IO" }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server & Socket.IO running on http://localhost:${PORT}`);
});
