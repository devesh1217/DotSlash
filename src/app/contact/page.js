'use client';
import { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gov-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-gov-lg rounded-gov p-8">
          <h1 className="text-gov-2xl font-bold text-gov-primary mb-6">Contact Us</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gov-text-light text-gov-sm mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="w-full px-4 py-2 border border-gov-border rounded-gov bg-gov-input focus:outline-none focus:ring-2 focus:ring-gov-primary"
                onChange={handleChange}
                value={formData.name}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gov-text-light text-gov-sm mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-4 py-2 border border-gov-border rounded-gov bg-gov-input focus:outline-none focus:ring-2 focus:ring-gov-primary"
                onChange={handleChange}
                value={formData.email}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-gov-text-light text-gov-sm mb-2">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows="4"
                required
                className="w-full px-4 py-2 border border-gov-border rounded-gov bg-gov-input focus:outline-none focus:ring-2 focus:ring-gov-primary"
                onChange={handleChange}
                value={formData.message}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gov-primary text-white py-2 px-4 rounded-gov hover:bg-gov-primary-light transition duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
