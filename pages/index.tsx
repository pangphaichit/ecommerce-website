import React from "react";
import NotificationBar from "../components/landing-page-component/NotificationBar";
import Navbar from "../components/Navbar";
import ImageSlider from "../components/landing-page-component/ImageSlider";

const Home: React.FC = () => {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <NotificationBar />
      <Navbar />
      <ImageSlider />
    </div>
  );
};

export default Home;
