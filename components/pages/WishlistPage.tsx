import React from "react";
import Navbar from "@/components/Navbar";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Wishlist from "@/components/wishlist-page-components/Wishlist";
import AppFooter from "@/components/AppFooter";

const WishlistPage = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <div className="lg:mt-15">
        <Breadcrumbs />
      </div>
      <Wishlist />
      <AppFooter />
    </div>
  );
};

export default WishlistPage;
