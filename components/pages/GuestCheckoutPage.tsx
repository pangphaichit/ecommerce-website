import React from "react";
import NotificationBar from "@/components/landing-page-components/NotificationBar";
import Navbar from "@/components/Navbar";

const GuestCheckoutPage = () => {
  return (
    <div>
      <NotificationBar />
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">Guest Checkout Page</h1>
      </div>
    </div>
  );
};

export default GuestCheckoutPage;
