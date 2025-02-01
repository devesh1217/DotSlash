import { useRouter } from 'next/navigation';

function SuccessModal({ applicationNumber, onClose }) {
    const router = useRouter();

    const handleViewApplication = () => {
        router.push(`/dashboard/applications/${applicationNumber}`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <svg className="h-8 w-8 text-gov-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Success Message */}
                    <h3 className="text-2xl font-bold text-gov-dark mb-2">Application Submitted!</h3>
                    <p className="text-gov-secondary mb-4">Your application has been successfully submitted.</p>

                    {/* Application Number */}
                    <div className="bg-gov-light rounded-lg p-4 mb-6">
                        <p className="text-sm text-gov-secondary mb-1">Application Number</p>
                        <p className="text-lg font-semibold text-gov-primary">{applicationNumber}</p>
                    </div>

                    {/* Next Steps */}
                    <div className="text-left mb-6">
                        <h4 className="font-semibold text-gov-dark mb-2">Next Steps:</h4>
                        <ul className="text-sm text-gov-secondary space-y-2">
                            <li>• Save your application number for future reference</li>
                            <li>• Track your application status in the dashboard</li>
                            <li>• You will receive updates via email</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={handleViewApplication}
                            className="w-full sm:w-auto px-6 py-2 bg-gov-primary text-white rounded-md hover:bg-gov-dark transition-colors"
                        >
                            View Application
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full sm:w-auto px-6 py-2 border border-gov-dark text-gov-dark rounded-md hover:bg-gov-light transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuccessModal;
