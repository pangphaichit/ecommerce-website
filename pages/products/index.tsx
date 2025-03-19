import React from "react";
import Navbar from "../../components/Navbar";
import NotificationBar from "../../components/landing-page-component/NotificationBar";

const Products = () => {
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

export default Products;
