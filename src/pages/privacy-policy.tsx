import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function PrivacyPolicy() {
    return (
        <>
            <Head>
                <title>Privacy Policy | Occasion Alerts</title>
                <meta name="description" content="Privacy Policy for Occasion Alerts" />
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
                <div className="flex-grow flex items-start justify-center w-full px-4 pt-8 pb-16">
                    <div className="w-full max-w-4xl">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 p-8">
                            <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Privacy Policy</h1>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-3 text-gray-800">1. Information We Collect</h2>
                                <p className="text-gray-600 mb-3">When you use our application, we collect the following information from your Google account:</p>
                                <ul className="list-disc list-inside ml-4 text-gray-600">
                                    <li>Email address</li>
                                    <li>Name</li>
                                    <li>Profile photo</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-3 text-gray-800">2. How We Use Your Information</h2>
                                <p className="text-gray-600 mb-3">We use the collected information for the following purposes:</p>
                                <ul className="list-disc list-inside ml-4 text-gray-600">
                                    <li>To provide and maintain our service</li>
                                    <li>To personalize your experience on our platform</li>
                                    <li>To communicate with you about your account and updates to our service</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-3 text-gray-800">3. Data Security</h2>
                                <p className="text-gray-600">We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-3 text-gray-800">4. Third-Party Services</h2>
                                <p className="text-gray-600">We use Google OAuth for authentication. Please refer to Google&apos;s Privacy Policy for more information on how they handle your data.</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-3 text-gray-800">5. Your Rights</h2>
                                <p className="text-gray-600">You have the right to access, update, or delete your personal information. You can do this by contacting us directly.</p>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-3 text-gray-800">6. Changes to This Policy</h2>
                                <p className="text-gray-600">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-3 text-gray-800">7. Contact Us</h2>
                                <p className="text-gray-600">If you have any questions about this Privacy Policy, please contact us at <Link className="text-orange-500 hover:text-orange-600 font-medium" href="mailto:support@mg.occasionalerts.com">support@mg.occasionalerts.com</Link></p>
                            </section>
                        </div>

                        <div className="mt-6 text-center">
                            <Link href="/" className="text-sm text-gray-600 hover:text-orange-500">
                                ← Back to dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}