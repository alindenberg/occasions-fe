import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Head from 'next/head';

export default function Profile() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const loading = status === "loading"
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !session) {
            router.push('/login')
        }
    }, [session, loading, router])

    const resendVerificationEmail = async () => {
        try {
            const response = await fetch('/api/auth/resend-verification', { method: 'POST' });
            const data = await response.json();
            if (response.ok) {
                toast.success('Verification email sent successfully');
            } else {
                toast.error(data.message || 'Failed to send verification email');
            }
        } catch (error) {
            console.error('Error resending verification email:', error);
            toast.error('An error occurred while sending the verification email');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!session) {
        return null
    }

    return (
        <>
            <Head>
                <title>OccasionAlert | Profile</title>
                <meta name="description" content="Manage your profile and account settings" />
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
                            <h1 className="text-xl font-bold text-gray-800">Profile</h1>
                        </div>

                        {/* Desktop header */}
                        <div className="hidden md:block mb-8">
                            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
                            <p className="text-gray-600">Manage your account settings</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl mx-auto">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Name</p>
                                        <p className="font-medium">{session.user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Email</p>
                                        <p className="font-medium">{session.user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1">Credits</p>
                                        <p className="font-medium">{session.user?.credits ?? 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                    onClick={() => router.push('/credits')}
                                >
                                    Purchase More Credits
                                </button>

                                {!session.user.is_email_verified && (
                                    <button
                                        onClick={resendVerificationEmail}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Resend Verification Email
                                    </button>
                                )}
                            </div>

                            {!session.user.is_email_verified && (
                                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-yellow-700 font-medium">
                                        Your email is not verified. Please check your inbox or click the button above to resend the verification email.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}

// Add empty getStaticProps to prevent 404 errors for data fetching
export async function getStaticProps() {
    return {
        props: {}
    }
}