import React from "react";
import AdminSidebar from "@/components/admin-dashboard-components/AdminSidebar";

const OrdersPage = () => {
  return (
    <div className="flex flex-row min-h-screen">
      <AdminSidebar />
      <h1 className="flex-1 p-6">Orders Page</h1>
    </div>
  );
};

export default OrdersPage;
