import React, { useState, useEffect } from "react";
import axios from "axios";
import NotificationBar from "../landing-page-components/NotificationBar";
import Navbar from "../Navbar";
import { useAuth } from "../../context/authentication";

const MyAccountPage = () => {
  const { userRole, logout, userId } = useAuth();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/api/customer/${userId}`);
        setUserName(res.data.data?.first_name);
        setLoading(false);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to fetch user data");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return (
    <div>
      <NotificationBar />
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Account</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded cursor-pointer"
          >
            Logout
          </button>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <p className="text-lg mb-2">
                Welcome, <strong>{userName || "User"}</strong>!
              </p>
              <p className="text-base">
                Your role is: <span className="font-medium">{userRole}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
