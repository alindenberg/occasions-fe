import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import { loadStripe } from '@stripe/stripe-js';
import {
    EmbeddedCheckoutProvider,
    EmbeddedCheckout
} from '@stripe/react-stripe-js';
import Sidebar from '@/components/Sidebar';
import Head from 'next/head';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!!);

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const loading = status === "loading";
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !session) {
            router.push('/login');
        }
    }, [session, loading, router]);

    const fetchClientSecret = useCallback(() => {
        // Create a Checkout Session
        return fetch("/api/checkout", {
            method: "POST",
            body: JSON.stringify({ quantity }),
        })
            .then((res) => res.json())
            .then((data) => data.clientSecret);
    }, [quantity]);

    const options = { fetchClientSecret };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const currentCredits = session.user?.credits || 0;
    const isOutOfCredits = currentCredits === 0;

    return (
        <>
            <Head>
                <title>Occasion Alerts | Purchase Credits</title>
                <meta name="description" content="Purchase credits for your Occasion Alerts account" />
            </Head>

            <div className="flex w-full overflow-x-hidden">
                <Sidebar
                    activeFilter=""
                    onFilterChange={() => { }}
                    openCreateModal={() => router.push('/?openCreateModal=true')}
                    onToggleCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
                    isMobileOpen={isMobileSidebarOpen}
                    onMobileClose={() => setIsMobileSidebarOpen(false)}
                />

                <main className={`flex-1 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} bg-gray-50 min-h-screen overflow-x-hidden transition-all duration-300`}>
                    <div className="w-full px-6 py-8">
                        {/* Mobile menu toggle */}
                        <div className="md:hidden flex items-center mb-6">
                            <button
                                onClick={() => setIsMobileSidebarOpen(true)}
                                className="text-gray-800 focus:outline-none mr-4"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </button>
                            <h1 className="text-xl font-bold text-gray-800">Purchase Credits</h1>
                        </div>

                        {/* Desktop header */}
                        <div className="hidden md:block mb-8">
                            <h1 className="text-2xl font-bold text-gray-800">Purchase Credits</h1>
                            <p className="text-gray-600">Buy credits to create and manage your occasions</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-8 max-w-5xl mx-auto">
                            {/* Credit balance display */}
                            <div className="flex justify-between items-center mb-6 border-b pb-6">
                                <h2 className="text-xl font-semibold">Your Credit Balance</h2>
                                <div className={`px-4 py-2 rounded-full ${isOutOfCredits ? 'bg-red-100' : 'bg-green-100'}`}>
                                    <span className={`font-bold text-lg ${isOutOfCredits ? 'text-red-600' : 'text-green-600'}`}>
                                        {currentCredits}
                                    </span>
                                    <span className="text-gray-600 ml-1">credits</span>
                                </div>
                            </div>

                            {/* Credit explanation */}
                            <div className="mb-8 bg-blue-50 rounded-lg p-5 border border-blue-100">
                                <h3 className="text-lg font-medium text-blue-800 mb-2">How Credits Work</h3>
                                <ul className="list-disc pl-5 space-y-2 text-blue-700">
                                    <li>Each credit allows you to create one occasion</li>
                                    <li>Credits are used when you create a new occasion</li>
                                    <li>Credits never expire</li>
                                    <li>You can purchase credits anytime</li>
                                </ul>
                            </div>

                            {/* Out of credits warning */}
                            {isOutOfCredits && (
                                <div className="mb-8 bg-orange-50 border-l-4 border-orange-500 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-orange-800">
                                                You&apos;re out of credits! Purchase more to continue creating occasions.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!isCheckingOut ? (
                                <div className="mb-8">
                                    <div className="max-w-md mx-auto">
                                        <div className="mb-6">
                                            <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">Quantity:</label>
                                            <div className="flex items-center">
                                                <select
                                                    id="quantity"
                                                    value={quantity}
                                                    name="quantity"
                                                    onChange={(e) => {
                                                        const quantity = parseInt(e.target.value);
                                                        setQuantity(quantity);
                                                    }}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                >
                                                    {Array.from(Array(10).keys()).map(i => (
                                                        <option key={i + 1} value={i + 1}>{i + 1} Credit{i > 0 ? 's' : ''}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 font-medium">Price per credit:</span>
                                                <span className="text-gray-800 font-semibold">$1.00</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2 text-lg">
                                                <span className="text-gray-700 font-medium">Total:</span>
                                                <span className="text-orange-600 font-bold">${quantity}.00</span>
                                            </div>
                                        </div>

                                        <button
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-md hover:scale-105 duration-200 ease-in-out text-lg"
                                            onClick={() => setIsCheckingOut(true)}
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-semibold">Checkout</h2>
                                        <button
                                            className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
                                            onClick={() => setIsCheckingOut(false)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Return to Cart
                                        </button>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <EmbeddedCheckoutProvider
                                            stripe={stripePromise}
                                            options={options}
                                        >
                                            <EmbeddedCheckout />
                                        </EmbeddedCheckoutProvider>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="text-center text-gray-500 text-sm mt-8">
                            © 2023 Occasion Alerts. All rights reserved.
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

// Add empty getStaticProps to prevent 404 errors for data fetching
export async function getStaticProps() {
    return {
        props: {}
    }
}