const express = require("express");
const eventController = require("../controllers/eventController");
const checkAdmin = require("../middlewares/checkAdmin");

const router = express.Router();

// Public routes
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEvent);

// Admin routes - Core REST endpoints as specified in PDF
router.post("/", checkAdmin.checkAdmin, eventController.createEvent);
router.put("/:id", checkAdmin.checkAdmin, eventController.updateEvent);
router.patch("/:id", checkAdmin.checkAdmin, eventController.updateEvent);
router.delete("/:id", checkAdmin.checkAdmin, eventController.deleteEvent);

// Backward-compatible routes for existing frontend calls
router.post("/admin", checkAdmin.checkAdmin, eventController.createEvent);
router.patch("/admin/:id", checkAdmin.checkAdmin, eventController.updateEvent);
router.put("/admin/:id", checkAdmin.checkAdmin, eventController.updateEvent);
router.delete("/admin/:id", checkAdmin.checkAdmin, eventController.deleteEvent);

module.exports = router;
