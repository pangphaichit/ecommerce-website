import React from "react";
import Navbar from "@/components/Navbar";
import NotificationBar from "@/components/landing-page-components/NotificationBar";

const AboutUsPage = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <h1>About Us</h1>
      <p>Learn more about our story and journey.</p>
    </div>
  );
};

export default AboutUsPage;
