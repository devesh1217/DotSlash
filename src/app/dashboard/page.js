'use client'
import { useState } from 'react';
import { FaHome, FaUser, FaFileAlt, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';

export default function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: <FaHome className="w-5 h-5" />, label: 'Home', link: '#' },
    { icon: <FaUser className="w-5 h-5" />, label: 'Profile', link: '#' },
    { icon: <FaFileAlt className="w-5 h-5" />, label: 'Documents', link: '#' },
    { icon: <FaCog className="w-5 h-5" />, label: 'Settings', link: '#' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between">
          {isSidebarOpen && <h2 className="text-2xl font-bold text-gray-800">e-Gov</h2>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2">
            <FaBars className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="flex items-center p-4 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-4">{item.label}</span>}
            </a>
          ))}
          <a
            href="#"
            className="flex items-center p-4 text-red-600 hover:bg-red-50 transition-colors mt-auto"
          >
            <FaSignOutAlt className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-4">Logout</span>}
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="p-4">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          </div>
        </header>
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium">Total Applications</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">1,234</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium">Pending Approvals</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">56</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium">Completed Tasks</h3>
              <p className="text-2xl font-bold text-gray-800 mt-2">892</p>
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-lg shadow p-6 md:col-span-2 lg:col-span-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800">Application #{item} Updated</h4>
                      <p className="text-sm text-gray-600">Status changed to "In Progress"</p>
                    </div>
                    <span className="text-sm text-gray-500">2h ago</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
