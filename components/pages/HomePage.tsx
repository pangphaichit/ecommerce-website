import React from "react";
import NotificationBar from "../landing-page-components/NotificationBar";
import Navbar from "../Navbar";
import ImageSlider from "../landing-page-components/ImageSlider";

const HomePage: React.FC = () => {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <NotificationBar />
      <Navbar />
      <ImageSlider />
    </div>
  );
};

export default HomePage;
