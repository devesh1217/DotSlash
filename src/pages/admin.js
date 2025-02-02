import { useState, useEffect } from 'react';

export default function Admin() {
    const [message, setMessage] = useState('');
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        const response = await fetch('/api/announcements');
        const data = await response.json();
        setAnnouncements(data.announcements);
    };

    const handleAddAnnouncement = async () => {
        const response = await fetch('/api/announcements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        if (response.ok) {
            setMessage('');
            fetchAnnouncements();
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        const response = await fetch('/api/announcements', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        if (response.ok) {
            fetchAnnouncements();
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter announcement"
                    className="border p-2 w-full"
                />
                <button
                    onClick={handleAddAnnouncement}
                    className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                >
                    Add Announcement
                </button>
            </div>
            <ul className="list-disc pl-5">
                {announcements.map((announcement) => (
                    <li key={announcement._id} className="mb-2">
                        {announcement.message}
                        <button
                            onClick={() => handleDeleteAnnouncement(announcement._id)}
                            className="bg-red-500 text-white px-2 py-1 ml-2 rounded"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
