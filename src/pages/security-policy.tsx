import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function SecurityPolicy() {
    return (
        <>
            <Head>
                <title>Security Policy | Occasion Alerts</title>
                <meta name="description" content="Security Policy for Occasion Alerts" />
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
                            <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Security Policy</h1>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-3 text-gray-800">1. Security Practices</h2>
                                <p className="text-gray-600 mb-3">We implement industry-standard security measures to protect your data:</p>
                                <ul className="list-disc list-inside ml-4 text-gray-600">
                                    <li>Secure data encryption</li>
                                    <li>Regular security audits and updates</li>
                                    <li>Secure authentication using Google OAuth</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-3 text-gray-800">2. Vulnerability Reporting</h2>
                                <p className="text-gray-600 mb-3">If you discover a security vulnerability, please report it to our security team at <Link className="text-orange-500 hover:text-orange-600 font-medium" href="mailto:support@mg.occasionalerts.com">support@mg.occasionalerts.com</Link>. We request that you:</p>
                                <ul className="list-disc list-inside ml-4 text-gray-600">
                                    <li>Provide detailed information about the vulnerability</li>
                                    <li>Allow reasonable time for us to respond before public disclosure</li>
                                    <li>Do not exploit the vulnerability for malicious purposes</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-3 text-gray-800">3. Data Protection</h2>
                                <p className="text-gray-600">We employ multiple layers of security controls to protect your data, including:</p>
                                <ul className="list-disc list-inside ml-4 text-gray-600">
                                    <li>Secure access controls and authentication</li>
                                    <li>Regular backups and disaster recovery procedures</li>
                                    <li>Monitoring systems for suspicious activities</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-2xl font-semibold mb-3 text-gray-800">4. Incident Response</h2>
                                <p className="text-gray-600">In the event of a security incident, we will:</p>
                                <ul className="list-disc list-inside ml-4 text-gray-600">
                                    <li>Promptly investigate and address the issue</li>
                                    <li>Notify affected users as required by law</li>
                                    <li>Take measures to prevent similar incidents</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold mb-3 text-gray-800">5. Contact Information</h2>
                                <p className="text-gray-600">For security-related inquiries or to report vulnerabilities, please contact us at <Link className="text-orange-500 hover:text-orange-600 font-medium" href="mailto:support@mg.occasionalerts.com">support@mg.occasionalerts.com</Link></p>
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