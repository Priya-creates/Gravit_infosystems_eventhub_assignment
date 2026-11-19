# 🎫 Smart Event Booking System (MERN + MySQL)

A modern, full-stack event booking application featuring **real-time seat synchronization** powered by **Socket.IO**, **ACID-compliant MySQL transactions**, and an aesthetic **Framer Motion + Parallax landing page** inspired by modern Webflow summit websites.

Built with **React 18**, **Tailwind CSS v4**, **Node.js**, **Express.js**, **MySQL2**, and **Socket.IO**.

---

## 📸 Key Features at a Glance

### 1. 🌐 Attendee & User Experience
* **Parallax Summit Landing Page:** Futuristic dark-mode landing experience with glowing cosmos ambient lighting, parallax scroll layers, attendee stats counter, and brand partners strip.
* **Real-Time Seat Tracking (Socket.IO):** Live, multi-browser seat availability updates instantly whenever a ticket is booked or cancelled—zero page refreshes needed.
* **Event Search & Advanced Filters:** Filter upcoming events by keyword search (title/description), venue location, or specific date.
* **Ticket Categories & Dynamic Pricing:** Tiered options (`Early Bird Pass`, `Standard Pass`, `VIP Platinum Access`) with automated price multipliers and listed privileges.
* **Google Maps Venue Integration:** Embedded venue map with dark-mode styling and a direct "Get Driving Directions" external link.
* **Animated Checkout & Failure Handling:** Smooth form checkout with an animated shake failure banner and clear messaging if capacity is exhausted.
* **Branded QR Pass Generation:** Instant confetti celebration upon reservation and a one-click canvas exporter that generates a high-resolution, branded PNG ticket pass with your QR code.

### 2. 🛡️ Administrative Portal
* **Event Management (CRUD):** Add, view, edit, and delete events with custom confirmation modals.
* **Track Bookings & Live Metrics:**
  * Real-time metrics overview: Total Events, Total Reservations, Tickets Sold, and Gross Revenue (₹).
  * Comprehensive bookings table displaying Customer Name, Email, Mobile, Summit Title, Ticket Tier, Quantity, Total Price, and Timestamp.
  * One-click **Cancel & Restore** action that automatically repopulates event seats and notifies all connected users via WebSockets.
* **Route Protection:** Administrative endpoints secured via `x-admin-secret` header verification.

---

## 🏛️ System Architecture

```text
[ Browser Client 1 ] <==== WebSocket (Socket.IO) ====> [ Express HTTP + Socket.IO Server ]
                                                                   ||
[ Browser Client 2 ] <==== WebSocket (Socket.IO) =====             || (Transactions / Pool)
                                                                   \/
                                                          [ MySQL 8.0 Database ]
                                                          (events & bookings tables)
```

---

## 🗂️ Project Directory Structure

```text
event-booking/
├── event_booking.sql            # MySQL database schema & seed data
├── README.md                    # Project documentation & setup instructions
├── client/                      # React 18 + Vite Frontend
│   ├── public/                  # Static assets & brand logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Global responsive navigation bar
│   │   │   └── EventCard.jsx    # Animated summit card with live seat indicator
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx         # Webflow/Summitra-Flowz style Parallax landing page
│   │   │   ├── EventListingPage.jsx    # Real-time event search & filter directory
│   │   │   ├── EventDetailsPage.jsx    # Venue maps, dynamic ticket tiers & details
│   │   │   ├── BookTicketPage.jsx      # Checkout form with failure animations
│   │   │   ├── BookingSuccessPage.jsx  # Confetti + Downloadable QR code pass
│   │   │   ├── AdminEventsPage.jsx     # Admin Dashboard (CRUD + Track Bookings)
│   │   │   ├── CreateEventPage.jsx     # Add event form
│   │   │   └── UpdateEventPage.jsx     # Edit event form
│   │   ├── utils/
│   │   │   └── socket.js        # Socket.IO client singleton
│   │   ├── App.jsx              # Central router configuration
│   │   └── index.css            # Tailwind CSS styling & custom typography
│   ├── .env                     # Client environment configuration
│   ├── vite.config.js           # Vite build configuration
│   └── package.json
└── server/                      # Node.js + Express Backend
    ├── controllers/
    │   ├── eventController.js   # Event CRUD, search/filter, and ticket tiers
    │   └── bookingController.js # Transactional booking, seat lock, and cancel logic
    ├── db/
    │   ├── pool.js              # MySQL connection pool
    │   └── event_booking.sql    # Schema backup script
    ├── middlewares/
    │   └── checkAdmin.js        # Admin authorization middleware (x-admin-secret)
    ├── routes/
    │   ├── eventRoutes.js       # RESTful event routes (GET, POST, PUT, DELETE)
    │   └── bookingRoutes.js     # Booking routes (POST, GET admin, cancel)
    ├── .env                     # Server environment variables
    ├── config.env               # Backup configuration
    ├── index.js                 # Server entry point with Socket.IO integration
    └── package.json
```

---

## 💻 Local Setup & Execution Guide

Follow these steps to run the application locally on your machine.

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **MySQL**: v8.0 or higher (running locally on port 3306)
* **npm**: v9.0.0 or higher

---

### Step 1: Database Setup
1. Open your terminal or MySQL Workbench.
2. Log in to MySQL:
   ```bash
   mysql -u root -p
   ```
3. Run the provided SQL script to automatically create the `event_booking` database, table schemas, and sample seed data:
   ```sql
   source event_booking.sql;
   ```
   *(Alternatively, in bash/cmd: `mysql -u root -p < event_booking.sql`)*

---

### Step 2: Backend Configuration & Startup
1. Open a terminal and navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify or edit your `server/.env` file with your MySQL password:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=event_booking
   PORT=5000
   NODE_ENV=development
   ADMIN_SECRET=adminsecretkey369
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   You should see:
   ```text
   Server & Socket.IO running on http://localhost:5000
   ```

---

### Step 3: Frontend Configuration & Startup
1. Open a new terminal and navigate to the `client/` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Check your `client/.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   VITE_ADMIN_SECRET=adminsecretkey369
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit:
   ```text
   http://localhost:5173
   ```

---

## 📡 API Endpoints Documentation

### Event Endpoints (`/api/events` & `/events`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/events` | Public | List all events (supports `?search=`, `?location=`, `?date=`) |
| `GET` | `/api/events/:id` | Public | Get single event details with dynamic ticket tiers |
| `POST` | `/api/events` | Admin | Create a new event |
| `PUT` | `/api/events/:id` | Admin | Update an existing event |
| `DELETE` | `/api/events/:id` | Admin | Delete an event and cascade-remove its bookings |

### Booking Endpoints (`/api/bookings` & `/bookings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | Public | Create new booking with MySQL ACID transaction & socket broadcast |
| `GET` | `/api/bookings/:id` | Public | Retrieve booking details by ID for ticket display & verification |
| `GET` | `/api/bookings/admin/all` | Admin | Retrieve all bookings with revenue stats & ticket count |
| `PATCH` | `/api/bookings/admin/:id/cancel` | Admin | Cancel a booking and replenish seats in the event pool |

> **Admin Header Authentication:** All admin routes require the following header:
> ```http
> x-admin-secret: adminsecretkey369
> ```

---

## 🧪 Real-Time Concurrency Test

To experience the real-time seat tracking in action:
1. Open **two browser tabs** side by side:
   * **Tab A:** `http://localhost:5173/events`
   * **Tab B:** `http://localhost:5173/event/1`
2. In **Tab B**, proceed to book 2 tickets.
3. Observe **Tab A**: The available seat count for that summit will update **instantly without page reload**, pushed live via Socket.IO.

---

## 📦 Deliverables Checklist

- [x] Full Git repository with separated `client` and `server` folders
- [x] Parallax Landing Page inspired by `https://summitra-flowz.webflow.io/`
- [x] Real-time seat availability indicator via **Socket.IO**
- [x] Google Maps venue integration on Event Details page
- [x] Ticket categories with dynamic pricing multipliers
- [x] Animated checkout form with failure shake handling
- [x] Confetti animation + downloadable QR code PNG ticket pass
- [x] Admin dashboard with Event CRUD and Track Bookings table
- [x] `event_booking.sql` schema script with sample seed data
- [x] Setup and execution guide in `README.md`
