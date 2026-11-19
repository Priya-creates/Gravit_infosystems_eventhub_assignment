const express = require("express");
const bookingController = require("../controllers/bookingController");
const checkAdmin = require("../middlewares/checkAdmin");

const router = express.Router();

// Admin: Track all bookings
router.get("/admin/all", checkAdmin.checkAdmin, bookingController.getAllBookings);
router.get("/admin", checkAdmin.checkAdmin, bookingController.getAllBookings);

// Admin: Cancel booking & restore seats
router.patch("/admin/:id/cancel", checkAdmin.checkAdmin, bookingController.cancelBooking);
router.delete("/admin/:id", checkAdmin.checkAdmin, bookingController.cancelBooking);

// Public: Create a new booking
router.post("/", bookingController.createBooking);

// Public / Verification: Get single booking by ID
router.get("/:id", bookingController.getBookingById);

// Admin: Fallback for GET /api/bookings with admin header
router.get("/", checkAdmin.checkAdmin, bookingController.getAllBookings);

module.exports = router;
