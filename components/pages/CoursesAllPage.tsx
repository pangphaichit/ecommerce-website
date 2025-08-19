import React from "react";
import Navbar from "@/components/Navbar";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import CoursesAllSection from "@/components/courses-page-components/CoursesAllSection";
import NewsletterSection from "@/components/NewsletterSection";
import AppFooter from "@/components/AppFooter";
import CoursesHeader from "@/components/courses-page-components/CoursesHeader";
const CoursesAllPage = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <div className="lg:mt-15">
        <Breadcrumbs />
      </div>
      <div className="w-full max-w-4xl mx-auto text-center mb-12 px-4">
        <CoursesHeader />
      </div>
      <CoursesAllSection />
      <NewsletterSection />
      <AppFooter />
    </div>
  );
};

export default CoursesAllPage;
