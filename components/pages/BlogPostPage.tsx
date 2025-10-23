import React from "react";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BlogPostPageSection from "@/components/blog-post-page-components/BlogPostPageSection";
import NewsletterSection from "@/components/NewsletterSection";
import AppFooter from "@/components/AppFooter";

const BlogPostPage = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <div className="lg:mt-15">
        <Breadcrumbs />
      </div>
      <BlogPostPageSection />
      <NewsletterSection />
      <AppFooter />
    </div>
  );
};

export default BlogPostPage;
