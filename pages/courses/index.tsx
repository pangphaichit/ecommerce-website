import React from "react";
import Navbar from "../../components/Navbar";
import NotificationBar from "../../components/landing-page-component/NotificationBar";

const Courses = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <h1>Our Courses</h1>
      <p>
        Explore the variety of courses we offer and enhance your skills with our
        expert-led programs.
      </p>
    </div>
  );
};

export default Courses;
