'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const token = searchParams.get('token');
                if (!token) {
                    setStatus('error');
                    setMessage('Verification token is missing');
                    return;
                }

                const response = await fetch(`/api/auth/verify?token=${token}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error);
                }

                setStatus('success');
                setMessage(data.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.message);
            }
        };

        verifyEmail();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gov-light p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border-t-4 border-gov-primary">
                {status === 'verifying' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gov-text mb-4">
                            Verifying your email...
                        </h2>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-primary mx-auto"></div>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gov-success mb-4">
                            Email Verified!
                        </h2>
                        <p className="text-gov-text mb-6">{message}</p>
                        <Link 
                            href="/auth/login"
                            className="inline-block bg-gov-primary text-white px-6 py-2 rounded-lg hover:bg-gov-dark transition-colors font-medium"
                        >
                            Proceed to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <h2 className="text-2xl font-bold text-red-500 mb-4">
                            Verification Failed
                        </h2>
                        <p className="text-white mb-6">{message}</p>
                        <Link 
                            href="/auth/signup"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
