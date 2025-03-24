import React from "react";
import NotificationBar from "../landing-page-components/NotificationBar";
import Navbar from "../Navbar";

const BlogPage = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <h1>Our Blog</h1>
      <p>
        Read our latest blog posts and articles on a variety of topics related
        to our industry, tips, and insights.
      </p>
    </div>
  );
};

export default BlogPage;
