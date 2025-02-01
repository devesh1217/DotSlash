'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminRegister() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        organization: ''
    });
    const [organizations, setOrganizations] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await fetch('/api/organizations');
                const data = await response.json();
                if (response.ok) {
                    // Access the organizations array from the response
                    setOrganizations(data.organizations || []);
                }
            } catch (error) {
                console.error('Error fetching organizations:', error);
                setOrganizations([]);
            }
        };

        fetchOrganizations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/admin/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            router.push('/admin/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gov-light flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gov-border">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gov-primary mb-2">
                        Admin Registration
                    </h1>
                    <p className="text-gov-text-light">
                        Create your administrative account
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gov-text font-medium mb-2">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                username: e.target.value
                            }))}
                            className="w-full p-3 border text-gov-text border-gov-border rounded-md bg-gov-input focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:border-gov-primary transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gov-text font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                email: e.target.value
                            }))}
                            className="w-full p-3 border text-gov-text border-gov-border rounded-md bg-gov-input focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:border-gov-primary transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gov-text font-medium mb-2">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                password: e.target.value
                            }))}
                            className="w-full p-3 border text-gov-text border-gov-border rounded-md bg-gov-input focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:border-gov-primary transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gov-text font-medium mb-2">Organization</label>
                        <select
                            value={formData.organization}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                organization: e.target.value
                            }))}
                            className="w-full p-3 border text-gov-text border-gov-border rounded-md bg-gov-input focus:outline-none focus:ring-2 focus:ring-gov-primary/20 focus:border-gov-primary transition-colors"
                            required
                        >
                            <option value="">Select Organization</option>
                            {Array.isArray(organizations) && organizations.map(org => (
                                <option key={org._id} value={org._id}>
                                    {org.displayName || org.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-md text-white font-medium transition-all transform hover:scale-[0.99] ${
                            loading 
                                ? 'bg-gov-primary/50 cursor-not-allowed' 
                                : 'bg-gov-primary hover:bg-gov-primary-light'
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                            </span>
                        ) : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link 
                        href="/admin/login" 
                        className="text-gov-primary hover:text-gov-primary-light font-medium transition-colors"
                    >
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
