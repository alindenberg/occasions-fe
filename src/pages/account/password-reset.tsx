import Link from 'next/link';
import { useState } from 'react';
import Head from 'next/head';

export default function PasswordResetPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const response = await fetch('/api/auth/password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                throw new Error('Failed to send reset email');
            }
            setResetSent(true);
        } catch (error) {
            setError('Failed to send reset email');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Head>
                <title>Reset Password | Occasion Alerts</title>
                <meta name="description" content="Reset your Occasion Alerts password" />
            </Head>

            <div className="min-h-screen bg-gray-50 flex flex-col w-full">
                {/* Header - centered logo */}
                <div className="py-10 w-full">
                    <div className="flex justify-center w-full">
                        <Link href="/" className="flex items-center">
                            <svg className="h-10 w-10 text-orange-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                            <span className="text-4xl font-bold text-orange-500">Occasion Alerts</span>
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow flex items-start justify-center w-full px-4 pt-8 pb-6">
                    <div className="w-full sm:w-96">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                            {resetSent ? (
                                <div className="px-6 py-8 text-center">
                                    <div className="flex justify-center mb-6">
                                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                                    <p className="text-gray-600 mb-6">We&apos;ve sent password reset instructions to your email address.</p>
                                    <Link href="/login" className="w-full inline-block py-2 px-4 border border-transparent rounded-md font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-center">
                                        Back to Login
                                    </Link>
                                </div>
                            ) : (
                                <div className="px-6 pt-6 pb-4">
                                    <div className="flex justify-center mb-3">
                                        <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                                            <svg className="h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-1">Reset your password</h2>
                                    <p className="text-gray-600 text-center mb-4">Enter your email and we&apos;ll send you a link to reset your password.</p>

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-red-600">{error}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-2 px-4 border border-transparent rounded-md font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Sending...' : 'Send reset instructions'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-600">
                                    Remember your password? <Link href="/login" className="font-medium text-orange-500 hover:text-orange-600">Log in</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}