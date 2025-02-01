'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNo: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            router.push('/auth/login?message=Please check your email to verify your account');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gov-light p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border-t-4 border-gov-primary">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gov-dark">
                        Create Government Account
                    </h2>
                </div>
                {error && (
                    <div className="bg-red-50 border border-gov-error text-gov-error px-4 py-2 rounded">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="text-gov-label font-medium">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 mt-1 border border-gov-input-border bg-white text-gov-input-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gov-primary focus:border-gov-primary"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
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
                            <label htmlFor="mobileNo" className="text-gov-label font-medium">Mobile Number</label>
                            <input
                                id="mobileNo"
                                name="mobileNo"
                                type="tel"
                                required
                                className="appearance-none rounded-lg relative block w-full px-3 py-2 mt-1 border border-gov-input-border bg-white text-gov-input-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gov-primary focus:border-gov-primary"
                                placeholder="+1234567890"
                                value={formData.mobileNo}
                                onChange={(e) => setFormData({...formData, mobileNo: e.target.value})}
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
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-gov-primary hover:bg-gov-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-secondary disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>

                    <p className="text-center text-gov-text">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-gov-link hover:text-gov-link-hover font-medium">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
