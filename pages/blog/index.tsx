import React from "react";
import Navbar from "../../components/Navbar";
import NotificationBar from "../../components/landing-page-component/NotificationBar";

const Blog = () => {
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

export default Blog;
