'use client'
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ApplicationDetails from './ApplicationDetails';

function ApplicationContent({ applicationId }) {
    const router = useRouter();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        fetchApplicationDetails();
    }, [applicationId]);

    const fetchApplicationDetails = async () => {
        try {
            const response = await fetch(`/api/admin/applications/${applicationId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data.error);

            setApplication(data);
            setRemarks(data.remarks || '');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
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

    const updateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            const response = await fetch(`/api/admin/applications/${applicationId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({
                    status: newStatus,
                    remarks
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setApplication(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-gov-error">{error}</div>;
    if (!application) return <div className="p-6">Application not found</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gov-text">Application Details</h1>
                    <p className="text-gov-text-light">Application #{application.applicationNumber}</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gov-text border border-gov-border rounded-md hover:bg-gov-hover"
                >
                    Back
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Service Information */}
                    <div className="bg-white rounded-lg shadow-gov p-6">
                        <h2 className="text-lg font-semibold text-gov-text mb-4">Service Information</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-gov-label">Service Name</label>
                                <p className="text-gov-text font-medium">{application.serviceId.name}</p>
                            </div>
                            <div>
                                <label className="text-gov-label">Organization</label>
                                <p className="text-gov-text">{application.serviceId.organization.name}</p>
                            </div>
                        </div>
                    </div>

                    {/* Applicant Information */}
                    <div className="bg-white rounded-lg shadow-gov p-6">
                        <h2 className="text-lg font-semibold text-gov-text mb-4">Applicant Information</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-gov-label">Name</label>
                                <p className="text-gov-text">
                                    {application.userId.name.first} {application.userId.name.last}
                                </p>
                            </div>
                            <div>
                                <label className="text-gov-label">Email</label>
                                <p className="text-gov-text">{application.userId.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Data */}
                    <div className="bg-white rounded-lg shadow-gov p-6">
                        <h2 className="text-lg font-semibold text-gov-text mb-4">Application Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(application.formData).map(([key, value]) => (
                                <div key={key}>
                                    <label className="text-gov-label">
                                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                    </label>
                                    <p className="text-gov-text">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Status Management */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-gov p-6">
                        <h2 className="text-lg font-semibold text-gov-text mb-4">Status Management</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-gov-label block mb-2">Current Status</label>
                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(application.status)}`}>
                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                </span>
                            </div>

                            <div>
                                <label className="text-gov-label block mb-2">Remarks</label>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    className="w-full p-2 border border-gov-border rounded-md focus:outline-none focus:ring-2 focus:ring-gov-primary/20"
                                    rows="4"
                                />
                            </div>

                            <div className="space-y-2">
                                {application.status !== 'approved' && (
                                    <button
                                        onClick={() => updateStatus('approved')}
                                        disabled={updating}
                                        className="w-full py-2 bg-gov-success text-white rounded-md hover:bg-gov-success/90 disabled:opacity-50"
                                    >
                                        Approve Application
                                    </button>
                                )}

                                {application.status !== 'rejected' && (
                                    <button
                                        onClick={() => updateStatus('rejected')}
                                        disabled={updating}
                                        className="w-full py-2 bg-gov-error text-white rounded-md hover:bg-gov-error/90 disabled:opacity-50"
                                    >
                                        Reject Application
                                    </button>
                                )}

                                {application.status !== 'processing' && (
                                    <button
                                        onClick={() => updateStatus('processing')}
                                        disabled={updating}
                                        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        Mark as Processing
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-lg shadow-gov p-6">
                        <h2 className="text-lg font-semibold text-gov-text mb-4">Timeline</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="w-2 h-2 mt-2 rounded-full bg-gov-success"></div>
                                <div>
                                    <p className="text-gov-text">Application Submitted</p>
                                    <p className="text-sm text-gov-text-light">
                                        {new Date(application.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            {application.processedAt && (
                                <div className="flex gap-4 items-start">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-gov-primary"></div>
                                    <div>
                                        <p className="text-gov-text">Application {application.status}</p>
                                        <p className="text-sm text-gov-text-light">
                                            {new Date(application.processedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Wrapper component to handle params

export default function ApplicationPage({ params }) {
    const applicationId = params.id;
    return <ApplicationContent applicationId={applicationId} />;
}
