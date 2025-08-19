import React from "react";
import Navbar from "@/components/Navbar";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductsSection from "@/components/products-page-components/ProductsSection";
import AppFooter from "@/components/AppFooter";

const ProductsPage = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <div className="lg:mt-15">
        <Breadcrumbs />
      </div>
      <ProductsSection />
      <AppFooter />
    </div>
  );
};

export default ProductsPage;
