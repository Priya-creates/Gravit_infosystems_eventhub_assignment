---

## **Server README.md** (Node.js + Express + MySQL)

```markdown
# Event Booking System - Backend

This is the **backend** of the Event Booking System prototype.

- **Tech stack:** Node.js, Express.js, MySQL
- **Purpose:** Handle API requests for events and bookings
- **Security:** Admin routes protected via header secret key

---

## 🗂 Project Structure

server/
├─ controllers/
│ ├─ eventController.js
│ └─ bookingController.js
├─ middlewares/
│ └─ checkAdmin.js
├─ routes/
│ ├─ eventRoutes.js
│ └─ bookingRoutes.js
├─ config.env
├─ package.json
└─ server.js

yaml
Copy code

---

## 🛠 Backend API Routes

### Events (`/api/events`)

| Method | Route        | Middleware   | Description                   |
| ------ | ------------ | ------------ | ----------------------------- |
| GET    | `/`          | -            | Fetch all events              |
| GET    | `/:id`       | -            | Fetch single event details    |
| POST   | `/admin`     | `checkAdmin` | Create new event (admin only) |
| PATCH  | `/admin/:id` | `checkAdmin` | Update event (admin only)     |
| DELETE | `/admin/:id` | `checkAdmin` | Delete event (admin only)     |

### Bookings (`/api/bookings`)

| Method | Route | Description          |
| ------ | ----- | -------------------- |
| POST   | `/`   | Create a new booking |

---

## 🔧 Setup Instructions

1. Clone the repository:

```bash
git clone <server-repo-url>
cd server
Install dependencies:

bash
Copy code
npm install
Create config.env in server root:

ini
Copy code
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_booking
ADMIN_SECRET=your_admin_secret_here
NODE_ENV=development
Run the backend server:

bash
Copy code
npm run dev
🌟 Backend Features
CRUD operations for events

Booking creation API

Admin route protection using secret key in headers

Tested with Thunder Client / Postman

💡 Future Improvements
User authentication system

Real-time seat availability

Payment gateway integration

Logging and monitoring

Email notifications on bookings

Admin analytics dashboard for revenue & bookings