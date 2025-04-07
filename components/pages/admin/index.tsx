import { useAuth } from "../../../context/authentication";

const AdminPage = () => {
  const { userRole, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded cursor-pointer"
        >
          Logout
        </button>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <p className="text-lg mb-2">
          Welcome, <strong>Admin</strong>!
        </p>
        <p className="text-base">
          Your role is: <span className="font-medium">{userRole}</span>
        </p>
      </div>
    </div>
  );
};

export default AdminPage;
