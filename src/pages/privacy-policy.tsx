import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
    return (
        <div className="w-full flex items-center justify-center p-4">
            <div className="w-full md:w-2/3 bg-white p-8 rounded-lg shadow-md border-2 border-orange-400 dark:text-black">
                <h1 className="text-center text-3xl font-bold mb-6">Privacy Policy</h1>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
                    <p>When you use our application, we collect the following information from your Google account:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>Email address</li>
                        <li>Name</li>
                        <li>Profile photo</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
                    <p>We use the collected information for the following purposes:</p>
                    <ul className="list-disc list-inside ml-4">
                        <li>To provide and maintain our service</li>
                        <li>To personalize your experience on our platform</li>
                        <li>To communicate with you about your account and updates to our service</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">3. Data Security</h2>
                    <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">4. Third-Party Services</h2>
                    <p>We use Google OAuth for authentication. Please refer to Google&apos;s Privacy Policy for more information on how they handle your data.</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
                    <p>You have the right to access, update, or delete your personal information. You can do this by contacting us directly.</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold mb-3">6. Changes to This Policy</h2>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at <Link className="text-blue-500 underline" href="mailto:support@mg.occasionalert.me">support@mg.occasionalert.me</Link></p>
                </section>
            </div>
        </div>
    );
}