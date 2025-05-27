import React from "react";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Navbar from "@/components/Navbar";
import ImageSlider from "@/components/landing-page-components/ImageSlider";
import NewArrivalSection from "@/components/landing-page-components/NewArrivalSection";

const HomePage: React.FC = () => {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <NotificationBar />
      <Navbar />
      <ImageSlider />
      <NewArrivalSection />
    </div>
  );
};

export default HomePage;
