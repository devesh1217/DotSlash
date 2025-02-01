'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        mobileNo: '',
        password: '',
        dob: '',
        gender: '',
        stageOfLife: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const inputClassName = "form-input w-full rounded-lg border-gray-300 shadow-sm text-gray-900 px-4 py-3 focus:border-gov-primary focus:ring focus:ring-gov-primary/20 transition-all duration-200 hover:border-gray-400";
    const selectClassName = "form-select w-full rounded-lg border-gray-300 shadow-sm text-gray-900 px-4 py-3 focus:border-gov-primary focus:ring focus:ring-gov-primary/20 transition-all duration-200 hover:border-gray-400";

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

            // Redirect to Aadhaar verification with temp token
            router.push(`/auth/aadhaar-verification?token=${data.tempToken}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-10 bg-white p-8 rounded-xl shadow-lg border-t-4 border-gov-primary">
                <div className="space-y-4">
                    <h2 className="text-center text-3xl font-bold text-gray-900 tracking-tight">
                        Create Your Government Account
                    </h2>
                    <p className="text-center text-gray-600 max-w-md mx-auto">
                        Fill in your details to register for e-Governance services. All fields marked with * are required.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
                    <div className="bg-gray-50 p-6 rounded-lg space-y-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center">
                            <svg className="h-6 w-6 mr-2 text-gov-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Personal Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name *
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    required
                                    className={inputClassName}
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Middle Name
                                </label>
                                <input
                                    id="middleName"
                                    type="text"
                                    className={inputClassName}
                                    value={formData.middleName}
                                    onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name *
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    required
                                    className={inputClassName}
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                                    Date of Birth *
                                </label>
                                <input
                                    id="dob"
                                    type="date"
                                    required
                                    className={inputClassName}
                                    value={formData.dob}
                                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                    Gender *
                                </label>
                                <select
                                    id="gender"
                                    required
                                    className={selectClassName}
                                    value={formData.gender}
                                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-gray-50 p-6 rounded-lg space-y-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center">
                            <svg className="h-6 w-6 mr-2 text-gov-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    className={inputClassName}
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mobile Number *
                                </label>
                                <input
                                    id="mobileNo"
                                    type="tel"
                                    required
                                    className={inputClassName}
                                    placeholder="+91 XXXXX XXXXX"
                                    value={formData.mobileNo}
                                    onChange={(e) => setFormData({...formData, mobileNo: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Account Security Section */}
                    <div className="bg-gray-50 p-6 rounded-lg space-y-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center">
                            <svg className="h-6 w-6 mr-2 text-gov-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Account Security
                        </h3>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password *
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className={inputClassName}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                Must be at least 8 characters long
                            </p>
                        </div>
                        <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                            <p className="font-medium text-blue-800 mb-1">Password requirements:</p>
                            <ul className="list-disc list-inside space-y-1 text-blue-700">
                                <li>At least 8 characters long</li>
                                <li>Must include at least one number</li>
                                <li>Must include at least one uppercase letter</li>
                                <li>Must include at least one special character</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full max-w-md py-3 px-4 rounded-lg text-white bg-gov-primary hover:bg-gov-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gov-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-lg font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : 'Create Account'}
                        </button>

                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-gov-primary hover:text-gov-primary/80 font-medium underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
