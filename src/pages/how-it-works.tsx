import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { useState } from 'react'
import Detail from '../components/Detail'
import Sidebar from '@/components/Sidebar'
import Head from 'next/head'

export default function HowItWorks() {
    const { data: session } = useSession()
    const isAuthenticated = !!session
    const router = useRouter()
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    return (
        <>
            <Head>
                <title>OccasionAlert | How It Works</title>
                <meta name="description" content="Learn how OccasionAlert helps you manage your important occasions" />
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
                            <h1 className="text-xl font-bold text-gray-800">How It Works</h1>
                        </div>

                        {/* Desktop header */}
                        <div className="hidden md:block mb-8">
                            <h1 className="text-2xl font-bold text-gray-800">How It Works</h1>
                            <p className="text-gray-600">Learn how OccasionAlert helps you manage your important occasions</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
                            <Detail />

                            <div className="mt-8 flex justify-center">
                                {isAuthenticated ? (
                                    <button
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                                        onClick={() => router.push('/')}
                                    >
                                        View My Occasions
                                    </button>
                                ) : (
                                    <button
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg transform transition duration-200 ease-in-out hover:scale-105 text-lg"
                                        onClick={() => router.push('/login')}
                                    >
                                        Log In
                                    </button>
                                )}
                            </div>
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
