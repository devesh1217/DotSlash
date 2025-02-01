'use client'
import { useEffect, useState } from 'react';

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch announcements from the backend API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/announcements'); // Ensure this matches your backend route
        const data = await response.json();
        if (response.ok) {
          setAnnouncements(data);
        } else {
          setError('Failed to fetch announcements');
        }
      } catch (err) {
        setError('An error occurred while fetching announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6 my-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Announcements</h3>

      {/* Display loading message */}
      {loading && <p className="text-gray-600">Loading announcements...</p>}

      {/* Display error message */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Display announcements */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <p className="text-gray-600">No announcements available.</p>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="p-4 bg-blue-50 rounded-lg shadow-md"
            >
              <h4 className="text-lg font-semibold text-gray-800">{announcement.title}</h4>
              <p className="text-sm text-gray-600">{announcement.content}</p>
              <p className="mt-2 text-xs text-gray-500">Posted on: {new Date(announcement.timestamp).toLocaleString()}</p>
              <p className="text-xs text-gray-500">Expires on: {new Date(announcement.expiry).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
