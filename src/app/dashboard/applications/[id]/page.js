"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/Skeleton';
import React from 'react';

export default function ApplicationDetails({ params }) {
    const resolvedParams = React.use(params);
    const router = useRouter();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplication = async () => {
            try {
                const response = await fetch(`/api/applications/${resolvedParams.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                const data = await response.json();

                if (!response.ok) throw new Error(data.error);
                setApplication(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [resolvedParams.id]);

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        return colors[status] || colors.pending;
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorDisplay message={error} />;
    if (!application) return <NotFound />;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gov-dark">
                                Application Details
                            </h1>
                            <p className="text-gov-secondary mt-1">
                                Application Number: {application.applicationNumber}
                            </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(application.status)}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                    </div>
                </div>

                {/* Service Details */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gov-dark mb-4">Service Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gov-label">Service Name</label>
                            <p className="text-gov-dark">{application.serviceId.name}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gov-label">Organization</label>
                            <p className="text-gov-dark">{application.serviceId.organization.name}</p>
                        </div>
                    </div>
                </div>

                {/* Form Data */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gov-dark mb-4">Application Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(application.formData).map(([key, value]) => (
                            <div key={key}>
                                <label className="text-sm text-gov-label">
                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                </label>
                                <p className="text-gov-dark">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Timeline */}
                {application.remarks && (
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gov-dark mb-4">Remarks</h2>
                        <p className="text-gov-secondary">{application.remarks}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="p-6 flex justify-end space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 text-gov-dark border border-gov-dark rounded hover:bg-gov-light transition-colors"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

const LoadingSkeleton = () => (
    <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ))}
        </div>
    </div>
);

const ErrorDisplay = ({ message }) => (
    <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-gov-error">{message}</p>
        </div>
    </div>
);

const NotFound = () => (
    <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gov-light rounded-lg p-4">
            <p className="text-gov-dark">Application not found</p>
        </div>
    </div>
);
