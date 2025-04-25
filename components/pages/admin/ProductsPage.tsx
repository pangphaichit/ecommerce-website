import React from "react";
import AdminSidebar from "@/components/admin-dashboard-components/AdminSidebar";
import AdminProductsDashboard from "@/components/admin-dashboard-components/AdminProductsDashboard";

const ProductsPage = () => {
  return (
    <div className="flex flex-row min-h-screen">
      <AdminSidebar />
      <AdminProductsDashboard />
    </div>
  );
};

export default ProductsPage;
