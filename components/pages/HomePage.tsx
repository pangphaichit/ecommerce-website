import React from "react";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Navbar from "@/components/Navbar";
import ImageSlider from "@/components/landing-page-components/ImageSlider";
import NewArrivalSection from "@/components/landing-page-components/NewArrivalSection";
import CategoriesSection from "@/components/landing-page-components/CategoriesSection";

const HomePage: React.FC = () => {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <NotificationBar />
      <Navbar />
      <ImageSlider />
      <NewArrivalSection />
      <CategoriesSection />
    </div>
  );
};

export default HomePage;
