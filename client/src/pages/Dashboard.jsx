import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

 
  const timelineMessage = location.state?.message;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-2">User Logged In</h1>
        <p className="text-gray-700 mb-4">
          Welcome! You have successfully logged in.
        </p>

        {timelineMessage && (
          <p className="text-green-600 font-semibold mb-4">
            {timelineMessage}
          </p>
        )}

        <Link
          to="/login"
          onClick={handleLogout}
          className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition"
        >
          Logout
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
