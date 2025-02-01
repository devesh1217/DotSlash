'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminApplications() {
    const router = useRouter();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10 });
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        organization: '',
        fromDate: '',
        toDate: ''
    });
    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {
        fetchOrganizations();
        fetchApplications();
    }, [pagination.page, filters]);

    const fetchOrganizations = async () => {
        try {
            const response = await fetch('/api/organizations');
            const data = await response.json();
            if (response.ok) {
                setOrganizations(data.organizations || []);
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...filters
            });

            const response = await fetch(`/api/admin/applications?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            const data = await response.json();
            
            if (response.ok) {
                setApplications(data.applications);
                setPagination(prev => ({ ...prev, ...data.pagination }));
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gov-text mb-2">Applications Management</h1>
                <p className="text-gov-text-light">Manage and process user applications</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-gov mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search applications..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
                    />
                    
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select
                        value={filters.organization}
                        onChange={(e) => handleFilterChange('organization', e.target.value)}
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
                    >
                        <option value="">All Organizations</option>
                        {organizations.map(org => (
                            <option key={org._id} value={org._id}>{org.name}</option>
                        ))}
                    </select>

                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={filters.fromDate}
                            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                            className="p-2 border rounded-md w-1/2 focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
                        />
                        <input
                            type="date"
                            value={filters.toDate}
                            onChange={(e) => handleFilterChange('toDate', e.target.value)}
                            className="p-2 border rounded-md w-1/2 focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
                        />
                    </div>
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-lg shadow-gov overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gov-light text-gov-text">
                            <tr>
                                <th className="px-6 py-3 text-left">Application</th>
                                <th className="px-6 py-3 text-left">Service</th>
                                <th className="px-6 py-3 text-left">Applicant</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Date</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gov-border text-gov-text">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                            ) : applications.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4">No applications found</td></tr>
                            ) : (
                                applications.map(app => (
                                    <tr key={app._id} className="hover:bg-gov-hover">
                                        <td className="px-6 py-4">{app.applicationNumber}</td>
                                        <td className="px-6 py-4">{app.serviceId.name}</td>
                                        <td className="px-6 py-4">
                                            {app.userId.name.first} {app.userId.name.last}<br />
                                            <span className="text-sm text-gov-text-light">{app.userId.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => router.push(`/admin/applications/${app.applicationNumber}`)}
                                                className="text-gov-primary hover:text-gov-primary-light"
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gov-border flex items-center justify-between">
                    <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-gov-text-light">
                        Page {pagination.page} of {pagination.pages || 1}
                    </span>
                    <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.pages}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
