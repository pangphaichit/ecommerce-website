import React from "react";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Navbar from "@/components/Navbar";
import ImageSlider from "@/components/landing-page-components/ImageSlider";
import NewArrivalSection from "@/components/landing-page-components/NewArrivalSection";
import CategoriesSection from "@/components/landing-page-components/CategoriesSection";
import BestSellingSection from "@/components/landing-page-components/BestSellingSection";
import NewsletterSection from "@/components/NewsletterSection";
import AppFooter from "@/components/AppFooter";

const HomePage: React.FC = () => {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <NotificationBar />
      <Navbar />
      <ImageSlider />
      <NewArrivalSection />
      <CategoriesSection />
      <BestSellingSection />
      <NewsletterSection />
      <AppFooter />
    </div>
  );
};

export default HomePage;
