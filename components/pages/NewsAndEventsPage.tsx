import React from "react";
import Navbar from "@/components/Navbar";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import NewsEventCard from "@/components/news-and-events-components/NewsEventCard";
import NewsletterSection from "@/components/NewsletterSection";
import AppFooter from "@/components/AppFooter";

const NewsAndEventsPage = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <div className=" lg:mt-15">
        <Breadcrumbs />
      </div>
      <NewsEventCard />
      <NewsletterSection />
      <AppFooter />
    </div>
  );
};

export default NewsAndEventsPage;
