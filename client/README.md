Client README.md (React + Vite + Tailwind)
# Event Booking System - Frontend

This is the **frontend** of the Event Booking System prototype.

- **Tech stack:** React, Vite, Tailwind CSS, Framer Motion, React Router DOM
- **Purpose:** Event listing, booking, and admin panel for managing events
- **Theme:** Modern, aesthetic, and fully themed UI

---

## 🗂 Project Structure



client/
├─ public/
├─ src/
│ ├─ components/
│ ├─ pages/
│ ├─ App.jsx
│ ├─ main.jsx
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
└─ README.md


---

## ⚛️ Frontend Routes

| Route                     | Component            | Description              |
| ------------------------- | -------------------- | ------------------------ |
| `/`                       | EventListingPage     | List all events          |
| `/event/:id`              | EventDetailsPage     | View event details       |
| `/booking/:id`            | BookTicketPage       | Book tickets for event   |
| `/booking-success/:id`    | BookingSuccessPage   | Booking confirmation     |
| `/admin`                  | AdminEventsPage      | Admin dashboard          |
| `/admin/event/create`     | CreateEventPage      | Create new event (admin) |
| `/admin/event/update/:id` | UpdateEventPage      | Update event (admin)     |

---

## 🌟 Frontend Features

- Event listing with **modern UI**
- Event details page with themed styling
- Booking system with **QR code download**
- Confetti animation on successful booking
- Admin panel for **CRUD operations**
- Real-time seat availability (planned feature)
- Fully responsive design for desktop & mobile

---

## 🔧 Setup Instructions

1. Clone the repository:

```bash
git clone <client-repo-url>
cd client


Install dependencies:

npm install


Create .env file in client root:

VITE_API_BASE_URL=http://localhost:5000/api
VITE_ADMIN_SECRET=your_admin_secret_here


Run the frontend:

npm run dev


Open http://localhost:5173
 to view the app.

💡 Future Improvements

Real-time seat monitoring

User authentication & personal bookings

Payment gateway integration

Event search & filters

Email notifications for bookings

Social media sharing

Ratings & reviews

Dark/light theme toggle

<img src="./public/1.png" width="400" />
<img src="./public/2.png" width="400" />
<img src="./public/3.png" width="400" />
<img src="./public/4.png" width="400" />
<img src="./public/5.png" width="400" />
<img src="./public/6.png" width="400" />
<img src="./public/7.png" width="400" />
<img src="./public/8.png" width="400" />
<img src="./public/9.png" width="400" />
<img src="./public/10.png" width="400" />
<img src="./public/11.png" width="400" />
<img src="./public/12.png" width="400" />
<img src="./public/13.png" width="400" />
<img src="./public/14.png" width="400" />
<img src="./public/15.png" width="400" />
<img src="./public/16.png" width="400" />
<img src="./public/17.png" width="400" />
<img src="./public/18.png" width="400" />
<img src="./public/19.png" width="400" />
<img src="./public/20.png" width="400" />
<img src="./public/21.png" width="400" />

