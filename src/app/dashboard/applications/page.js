'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/Skeleton';

export default function Applications() {

    const LoadingSkeleton = () => (
        <div className="p-6 space-y-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            ))}
        </div>
    );

    const EmptyState = () => (
        <div className="p-8 text-center">
            <div className="text-gov-secondary mb-4">No applications found</div>
            <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
    );

    const router = useRouter();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
    const [filters, setFilters] = useState({ status: '', search: '' });

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.status && { status: filters.status }),
                ...(filters.search && { search: filters.search })
            });

            const response = await fetch(`/api/user/applications?${queryParams}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
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

    useEffect(() => {
        fetchApplications();
    }, [pagination.page, filters]);

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
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gov-dark">My Applications</h1>
                <p className="text-gov-secondary mt-1">View and track all your applications</p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search applications..."
                    className="px-4 py-2 border rounded-md w-full sm:w-64"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
                <select
                    className="px-4 py-2 border rounded-md"
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <LoadingSkeleton />
                ) : applications.length === 0 ? (
                    <EmptyState />
                ) : (
                    <>
                        <div className="divide-y divide-gray-200">
                            {applications.map((app) => (
                                <div
                                    key={app._id}
                                    className="p-6 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => router.push(`/dashboard/applications/${app.applicationNumber}`)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-800">
                                                {app.serviceId.name}
                                            </h3>
                                            <p className="text-gov-secondary">
                                                Application #{app.applicationNumber}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {app.serviceId.organization.name}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(app.status)}`}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                            <span className="text-sm text-gray-500 mt-2">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                disabled={pagination.page === 1}
                                className="px-4 py-2 border rounded-md disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-gov-secondary">
                                Page {pagination.page} of {pagination.pages}
                            </span>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                disabled={pagination.page === pagination.pages}
                                className="px-4 py-2 border rounded-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
