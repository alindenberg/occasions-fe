import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import Link from 'next/link';

import styles from './Navbar.module.css';
import UserContext from '@/context/userContext';

export default function Navbar() {
    const userCtx = useContext(UserContext);
    const isAuthenticated = !!userCtx?.user;
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    function handleClick() {
        setIsOpen(false);
    }

    async function handleLogout() {
        await fetch('/api/auth/logout', {
            method: 'POST',
        }).then(() => {
            router.push('/');
        }).catch((error) => {
            console.error('Error:', error);
        });
    }
    return (
        <nav className="bg-orange-500 p-4">
            <div className="mx-auto flex items-center justify-between">
                <div className="text-white text-xl font-semibold">
                    <Link href="/">Occasions</Link>
                </div>
                <div className="hidden md:flex space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link href="/profile" className={styles.link}>Profile</Link>
                            <Link href="/how-it-works" className={styles.link}>How It Works</Link>
                            <button
                                onClick={handleLogout}
                                className={styles.link}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link onClick={handleClick} href="/how-it-works" className={styles.link}>How It Works</Link>
                            <Link onClick={handleClick} href="/login" className={styles.link}>Login</Link>
                        </>
                    )}
                </div>
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
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
                    <div className="md:hidden">
                        {isAuthenticated ? (
                            <>
                                <Link onClick={handleClick} href="/profile" className={`block px-4 py-2 ${styles.link}`}>Profile</Link>
                                <Link onClick={handleClick} href="/how-it-works" className={`block px-4 py-2 ${styles.link}`}>How It Works</Link>
                                <button onClick={handleLogout} className={`block px-4 py-2 ${styles.link}`}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link onClick={handleClick} href="/how-it-works" className={`block px-4 py-2 ${styles.link}`}>How It Works</Link>
                                <Link onClick={handleClick} href="/login" className={`block px-4 py-2 ${styles.link}`}>Login</Link>
                            </>
                        )}
                    </div>
                )
            }
        </nav >
    );
}
