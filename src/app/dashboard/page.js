'use client'
import { useState, useEffect } from 'react';
import { FaHome, FaUser, FaFileAlt, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { icon: <FaHome className="w-5 h-5" />, label: 'Home', link: '#' },
    { icon: <FaUser className="w-5 h-5" />, label: 'Profile', link: '#' },
    { icon: <FaFileAlt className="w-5 h-5" />, label: 'Documents', link: '#' },
    { icon: <FaCog className="w-5 h-5" />, label: 'Settings', link: '#' },
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('/api/user/applications', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        });
        const data = await response.json();
        if (response.ok) {
          setApplications(data.applications);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

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

            {/* Recent Applications Section */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Applications</h2>
                <button
                  onClick={() => router.push('/dashboard/applications')}
                  className="text-gov-primary hover:text-gov-dark text-sm"
                >
                  View All
                </button>
              </div>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                  <div className="p-4">Loading...</div>
                ) : applications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No applications found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {applications.map((app) => (
                      <div
                        key={app._id}
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/dashboard/applications/${app.applicationNumber}`)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium text-gray-800">
                              {app.serviceId.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Application #{app.applicationNumber}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-gray-500">
                          <span>{app.serviceId.organization.name}</span>
                          <span>
                            {new Date(app.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
