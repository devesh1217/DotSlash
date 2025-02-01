'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            // Save token to localStorage or handle with your preferred method
            localStorage.setItem('token', data.token);
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const message = searchParams.get('message');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gov-light p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border-t-4 border-gov-primary">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gov-text">
                        Government Portal Login
                    </h2>
                    <p className="mt-2 text-center text-sm text-gov-primary">
                        Access e-Governance Services
                    </p>
                </div>
                {message && (
                    <div className="bg-gov-accent/10 border border-gov-secondary text-gov-dark px-4 py-2 rounded">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-gov-error text-gov-error px-4 py-2 rounded">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="text-gov-label font-medium">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 mt-1 border border-gov-input-border bg-white text-gov-input-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gov-primary focus:border-gov-primary"
                                placeholder="example@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-gov-label font-medium">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 mt-1 border border-gov-input-border bg-white text-gov-input-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gov-primary focus:border-gov-primary"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div className="text-sm">
                                <Link href="/auth/forgot-password" className="text-gov-link hover:text-gov-link-hover font-medium">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-gov-primary hover:bg-gov-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-secondary disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {loading ? 'Authenticating...' : 'Login to Portal'}
                    </button>

                    <p className="text-center text-gov-text">
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="text-gov-link hover:text-gov-link-hover font-medium">
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
