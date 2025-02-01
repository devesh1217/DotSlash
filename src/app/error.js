'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 bg-gov-light">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6">
                    <svg 
                        className="w-8 h-8 text-gov-error" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                        />
                    </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gov-light mb-4">
                    Something went wrong!
                </h2>
                <p className="text-gov-secondary mb-8 max-w-md mx-auto">
                    An unexpected error has occurred. We've been notified and are working to fix the issue.
                </p>
                <div className="space-x-4">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-gov-light bg-gov-primary hover:bg-gov-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-accent transition-colors"
                    >
                        Try again
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="inline-flex items-center px-4 py-2 border border-gov-secondary rounded-lg text-sm font-medium text-gov-light hover:bg-gov-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-secondary transition-colors"
                    >
                        Go home
                    </button>
                </div>
            </div>
        </div>
    );
}
