const db = require("../db/pool");

// Handle ticket booking with ACID transaction and real-time socket sync
exports.createBooking = async (req, res) => {
  const connection = await db.getConnection();
  let bookingId = null;

  try {
    const { event_id, name, email, mobile, quantity, ticket_category, unit_price } = req.body;

    if (!event_id || !name || !email || !mobile || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields and provide a valid ticket count.",
      });
    }

    await connection.beginTransaction();

    // Lock event row to prevent race conditions during high concurrency
    const [eventRows] = await connection.query(
      "SELECT * FROM events WHERE id = ? FOR UPDATE",
      [event_id]
    );

    if (eventRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Target event could not be found." });
    }

    const event = eventRows[0];

    if (event.available_seats < quantity) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Reservation failed: Only ${event.available_seats} seat(s) remaining for this event.`,
      });
    }

    // Dynamic pricing check
    const effectivePrice = unit_price && !isNaN(unit_price) ? Number(unit_price) : Number(event.price);
    const totalAmount = (effectivePrice * Number(quantity)).toFixed(2);
    const category = ticket_category || "Standard";

    // Insert booking (with fallback if running against legacy database schema)
    try {
      const [bookingResult] = await connection.query(
        `INSERT INTO bookings (event_id, name, email, mobile, ticket_category, quantity, total_amount, booking_date, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'confirmed')`,
        [event_id, name.trim(), email.trim(), mobile.trim(), category, quantity, totalAmount]
      );
      bookingId = bookingResult.insertId;
    } catch (insertErr) {
      if (insertErr.code === "ER_BAD_FIELD_ERROR") {
        const [fallbackResult] = await connection.query(
          `INSERT INTO bookings (event_id, name, email, mobile, quantity, total_amount)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [event_id, name.trim(), email.trim(), mobile.trim(), quantity, totalAmount]
        );
        bookingId = fallbackResult.insertId;
      } else {
        throw insertErr;
      }
    }

    // Decrement remaining seats
    const newAvailableSeats = event.available_seats - quantity;
    await connection.query(
      "UPDATE events SET available_seats = ? WHERE id = ?",
      [newAvailableSeats, event_id]
    );

    await connection.commit();

    // Broadcast live availability to all connected browser clients
    const io = req.app.get("io");
    if (io) {
      io.emit("seat_updated", {
        eventId: Number(event_id),
        available_seats: newAvailableSeats,
        total_seats: event.total_seats,
      });

      io.emit("new_booking_created", {
        bookingId,
        eventId: Number(event_id),
        eventTitle: event.title,
        customerName: name,
        quantity,
        total_amount: totalAmount,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Ticket pass booked successfully!",
      bookingId,
      total_amount: totalAmount,
      ticket_category: category,
      available_seats: newAvailableSeats,
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Booking transaction failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "We encountered an issue while finalizing your reservation. Please try again.",
    });
  } finally {
    if (connection) connection.release();
  }
};

// Retrieve all bookings for admin dashboard
exports.getAllBookings = async (req, res) => {
  try {
    const { event_id } = req.query;

    let query = `
      SELECT 
        b.id,
        b.event_id,
        b.name,
        b.email,
        b.mobile,
        COALESCE(b.ticket_category, 'Standard') AS ticket_category,
        b.quantity,
        b.total_amount,
        COALESCE(b.booking_date, b.created_at, NOW()) AS booking_date,
        COALESCE(b.status, 'confirmed') AS status,
        e.title AS event_title,
        e.location AS event_location,
        e.date AS event_date,
        e.price AS event_base_price
      FROM bookings b
      LEFT JOIN events e ON b.event_id = e.id
    `;
    const params = [];

    if (event_id) {
      query += " WHERE b.event_id = ?";
      params.push(event_id);
    }

    query += " ORDER BY b.id DESC";

    const [rows] = await db.query(query, params);

    // Calculate aggregated metrics
    const confirmedBookings = rows.filter((r) => r.status === "confirmed");
    const totalRevenue = confirmedBookings.reduce((sum, r) => sum + Number(r.total_amount || 0), 0);
    const totalTicketsSold = confirmedBookings.reduce((sum, r) => sum + Number(r.quantity || 0), 0);

    return res.status(200).json({
      success: true,
      count: rows.length,
      stats: {
        totalRevenue: totalRevenue.toFixed(2),
        totalTicketsSold,
      },
      bookings: rows,
    });
  } catch (error) {
    console.error("Failed to fetch bookings:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not retrieve booking records.",
    });
  }
};

// Fetch single booking details for receipt / ticket verification
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid booking ID parameter." });
    }

    const [rows] = await db.query(
      `SELECT 
        b.id,
        b.event_id,
        b.name,
        b.email,
        b.mobile,
        COALESCE(b.ticket_category, 'Standard') AS ticket_category,
        b.quantity,
        b.total_amount,
        COALESCE(b.booking_date, b.created_at, NOW()) AS booking_date,
        COALESCE(b.status, 'confirmed') AS status,
        e.title AS event_title,
        e.location AS event_location,
        e.date AS event_date,
        e.img AS event_img
       FROM bookings b
       LEFT JOIN events e ON b.event_id = e.id
       WHERE b.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Booking record not found." });
    }

    return res.status(200).json({
      success: true,
      booking: rows[0],
    });
  } catch (error) {
    console.error("Error retrieving booking:", error.message);
    return res.status(500).json({ success: false, message: "Failed to load booking details." });
  }
};

// Cancel an existing reservation and replenish event seats
exports.cancelBooking = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { id } = req.params;
    await connection.beginTransaction();

    const [rows] = await connection.query(
      "SELECT * FROM bookings WHERE id = ? FOR UPDATE",
      [id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Reservation not found." });
    }

    const booking = rows[0];
    if (booking.status === "cancelled") {
      await connection.rollback();
      return res.status(400).json({ success: false, message: "This reservation is already cancelled." });
    }

    await connection.query("UPDATE bookings SET status = 'cancelled' WHERE id = ?", [id]);

    await connection.query(
      "UPDATE events SET available_seats = available_seats + ? WHERE id = ?",
      [booking.quantity, booking.event_id]
    );

    const [eventRows] = await connection.query("SELECT * FROM events WHERE id = ?", [booking.event_id]);
    await connection.commit();

    const io = req.app.get("io");
    if (io && eventRows.length > 0) {
      io.emit("seat_updated", {
        eventId: Number(booking.event_id),
        available_seats: eventRows[0].available_seats,
        total_seats: eventRows[0].total_seats,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reservation cancelled and seats successfully returned to event pool.",
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Cancel booking error:", error.message);
    return res.status(500).json({ success: false, message: "Could not process booking cancellation." });
  } finally {
    if (connection) connection.release();
  }
};
