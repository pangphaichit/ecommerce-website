import React from "react";
import Navbar from "@/components/Navbar";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import ProductsSection from "@/components/products-page-components/ProductsSection";
import AppFooter from "@/components/AppFooter";

const ProductsPage = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <ProductsSection />
      <AppFooter />
    </div>
  );
};

export default ProductsPage;
