// controllers/eventController.js
const db = require("../db/pool");

// Helper to attach dynamic ticket tiers
const attachTicketTiers = (event) => {
  const basePrice = Number(event.price) || 0;
  return {
    ...event,
    ticket_tiers: [
      {
        id: "early_bird",
        name: "Early Bird Pass",
        multiplier: 0.85,
        price: Math.round(basePrice * 0.85),
        description: "Special early discount pass. Standard entry & digital perks.",
        perks: ["General entry", "Digital badge", "Event guidebook"],
      },
      {
        id: "standard",
        name: "Standard Pass",
        multiplier: 1.0,
        price: basePrice,
        description: "Full event access with standard seat reservation.",
        perks: ["All sessions entry", "Standard seating", "Networking zone", "Certificate"],
      },
      {
        id: "vip",
        name: "VIP Platinum Access",
        multiplier: 1.6,
        price: Math.round(basePrice * 1.6),
        description: "Front-row priority seating, speaker lounge & VIP gift kit.",
        perks: ["Front-row reserved seat", "Speaker lounge access", "VIP gift pack", "Fast-track entry"],
      },
    ],
  };
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, date, total_seats, available_seats, price, img } = req.body;

    // Basic validation
    if (!title || !location || !date || !total_seats || !price) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    if (isNaN(total_seats) || total_seats <= 0) {
      return res.status(400).json({ success: false, message: "Total seats must be a positive number" });
    }

    if (price < 0) {
      return res.status(400).json({ success: false, message: "Price must be a positive number" });
    }

    if (isNaN(new Date(date).getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    // Insert query
    const query = `
      INSERT INTO events (title, description, location, date, total_seats, available_seats, price, img)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      title,
      description,
      location,
      date,
      total_seats,
      available_seats || total_seats,
      price,
      img || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    ]);

    const io = req.app.get("io");
    if (io) {
      io.emit("event_created", {
        id: result.insertId,
        title,
        available_seats: available_seats || total_seats,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      eventId: result.insertId,
    });
  } catch (error) {
    console.error("Error inserting event:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Update Event (Admin only)
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, description, location, date, total_seats, available_seats, price, img } = req.body;

    // Check if event exists
    const [existingEvent] = await db.query(`SELECT * FROM events WHERE id = ?`, [eventId]);
    if (existingEvent.length === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Build dynamic update query
    const fields = [];
    const values = [];
    if (title !== undefined) { fields.push("title = ?"); values.push(title); }
    if (description !== undefined) { fields.push("description = ?"); values.push(description); }
    if (location !== undefined) { fields.push("location = ?"); values.push(location); }
    if (date !== undefined) { fields.push("date = ?"); values.push(date); }
    if (total_seats !== undefined) { fields.push("total_seats = ?"); values.push(total_seats); }
    if (available_seats !== undefined) { fields.push("available_seats = ?"); values.push(available_seats); }
    if (price !== undefined) { fields.push("price = ?"); values.push(price); }
    if (img !== undefined) { fields.push("img = ?"); values.push(img); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    values.push(eventId);

    const query = `UPDATE events SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await db.query(query, values);

    // Broadcast update via Socket.io
    const io = req.app.get("io");
    if (io && available_seats !== undefined) {
      io.emit("seat_updated", {
        eventId: Number(eventId),
        available_seats: Number(available_seats),
        total_seats: total_seats !== undefined ? Number(total_seats) : existingEvent[0].total_seats,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error updating event:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Delete Event (Admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const [existingEvent] = await db.query(`SELECT * FROM events WHERE id = ?`, [eventId]);
    if (existingEvent.length === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const [result] = await db.query(`DELETE FROM events WHERE id = ?`, [eventId]);

    const io = req.app.get("io");
    if (io) {
      io.emit("event_deleted", { eventId: Number(eventId) });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error deleting event:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Get All Events (with improved partial search & filters)
exports.getAllEvents = async (req, res) => {
  try {
    const { search, location, date } = req.query;
    let query = `SELECT * FROM events WHERE 1=1`;
    let values = [];

    // --- Search by title or description ---
    if (search) {
      const keyword = `%${search.toLowerCase()}%`;
      query += ` AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ?)`;
      values.push(keyword, keyword);
    }

    // --- Filter by location ---
    if (location) {
      const locKeyword = `%${location.toLowerCase()}%`;
      query += ` AND LOWER(location) LIKE ?`;
      values.push(locKeyword);
    }

    // --- Filter by date ---
    if (date) {
      query += ` AND DATE(date) = ?`;
      values.push(date);
    }

    query += ` ORDER BY date ASC`;

    const [rows] = await db.query(query, values);

    const eventsWithTiers = rows.map(attachTicketTiers);

    return res.status(200).json({
      success: true,
      count: eventsWithTiers.length,
      events: eventsWithTiers,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ Get Single Event
exports.getEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    if (!eventId || isNaN(eventId)) {
      return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    const [rows] = await db.query(`SELECT * FROM events WHERE id = ?`, [eventId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      event: attachTicketTiers(rows[0]),
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
