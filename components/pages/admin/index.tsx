import AdminSidebar from "@/components/admin-dashboard-components/AdminSidebar";
import AdminOverviewDashboard from "@/components/admin-dashboard-components/AdminOverviewDashboard";
const AdminPage = () => {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <AdminOverviewDashboard />
    </div>
  );
};

export default AdminPage;
