import React from "react";
import Navbar from "@/components/Navbar";
import NotificationBar from "@/components/landing-page-components/NotificationBar";

const ProductsPage = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <h1>Our Products</h1>
      <p>
        Discover the range of products we offer and learn about their quality
        and craftsmanship.
      </p>
    </div>
  );
};

export default ProductsPage;
