import React from "react";
import Navbar from "../../components/Navbar";
import NotificationBar from "../../components/landing-page-component/NotificationBar";

const NewsAndEvents = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <h1>News & Events</h1>
      <p>
        Stay updated with the latest news, announcements, and upcoming events.
      </p>
    </div>
  );
};

export default NewsAndEvents;
