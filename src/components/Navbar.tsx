import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react"
import styles from './Navbar.module.css';

interface NavbarProps {
    onToggleMobileSidebar?: () => void;
}

export default function Navbar({ onToggleMobileSidebar }: NavbarProps) {
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (status === 'loading') {
        return (
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md p-4`}>
                <div className="mx-auto flex items-center justify-center">
                    <div className="animate-pulse h-6 w-24 bg-gray-200 rounded"></div>
                </div>
            </nav>
        );
    }

    function handleClick() {
        setIsOpen(false);
    }

    async function handleLogout() {
        await signOut({ redirect: false });
        handleClick();
        router.push('/');
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'} p-4`}>
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    {isAuthenticated && (
                        <button
                            onClick={onToggleMobileSidebar}
                            className="mr-3 md:hidden text-gray-800 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    )}
                    <Link href="/" onClick={handleClick} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-800 font-semibold text-xl">OccasionAlert</span>
                    </Link>
                </div>
                <div className="hidden md:flex items-center space-x-6">
                    {isAuthenticated ? (
                        <>
                            <Link href="/profile" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">Profile</Link>
                            <Link href="/how-it-works" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">How It Works</Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link onClick={handleClick} href="/how-it-works" className="text-gray-600 hover:text-orange-500 transition-colors font-medium">How It Works</Link>
                            <Link onClick={handleClick} href="/login" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors font-medium">Login</Link>
                        </>
                    )}
                </div>
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            )}
                        </svg>
                    </button>
                </div>
            </div>
            {
                isOpen && (
                    <div className="md:hidden bg-white shadow-lg rounded-b-lg mt-2 p-4 absolute left-0 right-0">
                        {isAuthenticated ? (
                            <>
                                <Link onClick={handleClick} href="/profile" className="block py-3 text-gray-600 hover:text-orange-500 transition-colors font-medium">Profile</Link>
                                <Link onClick={handleClick} href="/how-it-works" className="block py-3 text-gray-600 hover:text-orange-500 transition-colors font-medium">How It Works</Link>
                                <button onClick={handleLogout} className="block w-full text-left py-3 text-gray-600 hover:text-orange-500 transition-colors font-medium">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link onClick={handleClick} href="/how-it-works" className="block py-3 text-gray-600 hover:text-orange-500 transition-colors font-medium">How It Works</Link>
                                <Link onClick={handleClick} href="/login" className="block py-3 text-gray-600 hover:text-orange-500 transition-colors font-medium">Login</Link>
                            </>
                        )}
                    </div>
                )
            }
        </nav >
    );
}
