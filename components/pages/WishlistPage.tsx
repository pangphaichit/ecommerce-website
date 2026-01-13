import React from "react";
import Navbar from "@/components/Navbar";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import WishlistSection from "@/components/wishlist-page-components/WishlistSection";
import AppFooter from "@/components/AppFooter";

const WishlistPage = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <div className="lg:mt-15">
        <Breadcrumbs />
      </div>
      <WishlistSection />
      <AppFooter />
    </div>
  );
};

export default WishlistPage;
