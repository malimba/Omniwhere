import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/logout";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex items-center mb-6">
         <span style={{ fontSize: '3.5rem', marginRight: '1rem' }}>🌐</span>
        <h1 className="text-3xl font-bold">Omniwhere Dashboard</h1>
      </div>
       <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div

          className="bg-gray-800 p-4 rounded-2xl shadow-md hover:bg-gray-700 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => navigate(`/terminal/${localStorage.getItem('device_id')}`)}
        >

          <h2 className="text-xl font-semibold mb-2">🔧 Terminal Access</h2>
          <p className="text-sm text-gray-300">Launch remote shell via browser</p>
        </div>

        <div
          className="bg-gray-800 p-4 rounded-2xl shadow-md hover:bg-gray-700 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => navigate("/files")}
        >
          <h2 className="text-xl font-semibold mb-2">📂 File Explorer</h2>
          <p className="text-sm text-gray-300">Browse & manage files over SSH</p>
        </div>

        <div
          className="bg-gray-800 p-4 rounded-2xl shadow-md hover:bg-gray-700 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => navigate("/devices")}
        >
          <h2 className="text-xl font-semibold mb-2">💻 Devices</h2>
          <p className="text-sm text-gray-300">Manage registered devices</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;