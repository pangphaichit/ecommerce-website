import React from "react";
import Navbar from "@/components/Navbar";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ShopHistory from "@/components/about-us-components/ShopHistory";
import NewsletterSection from "@/components/NewsletterSection";
import AppFooter from "@/components/AppFooter";

const AboutUsPage = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <div className="lg:ml-[12.5%] lg:mt-15">
        <Breadcrumbs />
      </div>
      <ShopHistory />
      <NewsletterSection />
      <AppFooter />
    </div>
  );
};

export default AboutUsPage;
