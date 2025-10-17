import React from "react";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BlogSection from "@/components/blog-page-components/BlogSection";
import NewsletterSection from "@/components/NewsletterSection";
import AppFooter from "@/components/AppFooter";

const BlogPage = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <div className="lg:mt-15">
        <Breadcrumbs />
      </div>
      <BlogSection />
      <NewsletterSection />
      <AppFooter />
    </div>
  );
};

export default BlogPage;
