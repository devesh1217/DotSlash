"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/Skeleton';
import FormField from './FormField';

function ServiceApplication({ serviceId }) {
    const router = useRouter();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});
    const [userDocuments, setUserDocuments] = useState([]);
    const [documentStatus, setDocumentStatus] = useState({});

    // Fetch both service details and user documents
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [serviceRes, documentsRes] = await Promise.all([
                    fetch(`/api/services/${serviceId}`),
                    fetch('/api/user/documents',{headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
                ]);

                const serviceData = await serviceRes.json();
                const documentsData = await documentsRes.json();

                if (!serviceRes.ok) throw new Error(serviceData.error);
                if (!documentsRes.ok) throw new Error(documentsData.error);

                setService(serviceData);
                setUserDocuments(documentsData.documents);

                // Check document availability
                const status = {};
                serviceData.requiredDocuments.forEach(doc => {
                    status[doc.documentCode] = documentsData.documents.some(
                        userDoc => userDoc.documentCode === doc.documentCode
                    );
                });
                setDocumentStatus(status);

                // Initialize form data
                const initialFormData = {};
                serviceData.formFields.forEach(field => {
                    initialFormData[field.name] = '';
                });
                setFormData(initialFormData);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [serviceId]);

    const handleInputChange = React.useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const DocumentStatusCard = ({ doc }) => {
        const isAvailable = documentStatus[doc.documentCode];
        const userDoc = userDocuments.find(d => d.documentCode === doc.documentCode);

        return (
            <div className={`p-4 rounded-lg border ${
                isAvailable ? 'border-gov-success bg-green-50' : 'border-gov-error bg-red-50'
            }`}>
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-medium text-gov-dark">{doc.name}</h3>
                        {isAvailable && userDoc && (
                            <div className="mt-2 text-xs text-gov-secondary">
                                <p>Document No: {userDoc.documentNumber}</p>
                                <p>Issued by: {userDoc.authority}</p>
                            </div>
                        )}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                        isAvailable ? 'bg-gov-success/20 text-gov-success' : 'bg-gov-error/20 text-gov-error'
                    }`}>
                        {isAvailable ? 'Available' : 'Not Available'}
                    </div>
                </div>
                {!isAvailable && (
                    <div className="mt-2 text-xs text-gov-error">
                        This document is required. Please obtain it before proceeding.
                    </div>
                )}
            </div>
        );
    };

    const canSubmit = () => {
        return service?.requiredDocuments.every(doc => documentStatus[doc.documentCode]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit()) {
            alert('Please ensure all required documents are available before submitting.');
            return;
        }

        try {
            const response = await fetch('/api/services/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    serviceId,
                    formData
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit application');
            }

            alert(`Application submitted successfully!\nApplication Number: ${data.applicationNumber}`);
            router.push('/dashboard'); // Or wherever you want to redirect
        } catch (error) {
            alert('Error submitting application: ' + error.message);
        }
    };

    const LoadingSkeleton = () => (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );

    // Progress steps component
    const ProgressSteps = ({ currentStep }) => {
        const steps = ['Documents', 'Details', 'Review'];
        return (
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    {steps.map((step, idx) => (
                        <React.Fragment key={step}>
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    idx < currentStep ? 'bg-gov-success text-white' :
                                    idx === currentStep ? 'bg-gov-primary text-white' :
                                    'bg-gov-light text-gov-dark'
                                }`}>
                                    {idx + 1}
                                </div>
                                <span className="mt-2 text-sm text-gov-dark">{step}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`h-1 w-full mx-4 ${
                                    idx < currentStep ? 'bg-gov-success' : 'bg-gov-light'
                                }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    };

    if (loading) return <LoadingSkeleton />;
    if (error) return (
        <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-gov-error">{error}</p>
            </div>
        </div>
    );
    if (!service) return (
        <div className="max-w-4xl mx-auto p-6 text-center">
            <div className="bg-gov-light rounded-lg p-4">
                <p className="text-gov-dark">Service not found</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gov-light">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gov-primary mb-2">{service.name}</h1>
                <p className="text-gov-dark">{service.description}</p>
                <div className="flex items-center mt-2 text-gov-secondary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>{service.organization.name}</span>
                </div>
            </div>

            <ProgressSteps currentStep={0} />

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Required Documents Section */}
                <section className="bg-white p-6 rounded-lg shadow-lg border border-gov-light">
                    <h2 className="text-xl font-semibold mb-6 text-gov-primary">Required Documents</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {service.requiredDocuments.map((doc) => (
                            <DocumentStatusCard
                                key={doc.documentCode}
                                doc={doc}
                            />
                        ))}
                    </div>
                    {!canSubmit() && (
                        <div className="mt-4 p-4 bg-gov-error/10 rounded-lg">
                            <p className="text-gov-error text-sm">
                                Some required documents are missing. Please obtain them before proceeding.
                            </p>
                        </div>
                    )}
                </section>

                {/* Form Fields Section */}
                <section className="bg-white p-6 rounded-lg shadow-lg border border-gov-light">
                    <h2 className="text-xl font-semibold mb-6 text-gov-primary">Application Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {service.formFields.map((field) => (
                            <FormField
                                key={`${field.name}-field`}
                                field={field}
                                value={formData[field.name]}
                                onChange={handleInputChange}
                            />
                        ))}
                    </div>
                </section>

                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border text-gov-text border-gov-dark rounded-md hover:bg-gov-dark/50 transition-colors "
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!canSubmit()}
                        className={`px-6 py-2 rounded-md transition-colors ${
                            canSubmit()
                                ? 'bg-gov-primary text-white hover:bg-gov-dark'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Submit Application
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ServiceApplication;
