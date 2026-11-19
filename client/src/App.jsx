import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import EventListingPage from "./pages/EventListingPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import BookTicketPage from "./pages/BookTicketPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import AdminEventsPage from "./pages/AdminEventsPage";
import CreateEventPage from "./pages/CreateEventPage";
import UpdateEventPage from "./pages/UpdateEventPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page (Webflow/Summitra-Flowz Style with Parallax) */}
        <Route path="/" element={<LandingPage />} />

        {/* Event Directory & Search */}
        <Route path="/events" element={<EventListingPage />} />

        {/* Event Details with Google Maps & Dynamic Pricing Tiers */}
        <Route path="/event/:id" element={<EventDetailsPage />} />

        {/* Checkout Flow with Animations & QR Generation */}
        <Route path="/booking/:id" element={<BookTicketPage />} />
        <Route path="/booking-success/:id" element={<BookingSuccessPage />} />

        {/* Administrative Portal with Event CRUD & Booking Tracking */}
        <Route path="/admin" element={<AdminEventsPage />} />
        <Route path="/admin/event/create" element={<CreateEventPage />} />
        <Route path="/admin/event/update/:id" element={<UpdateEventPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
