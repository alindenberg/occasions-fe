import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-orange-500 p-4">
            <div className="mx-auto flex items-center justify-between">
                <div className="text-white text-xl font-semibold">
                    <Link href="/">Occasions</Link>
                </div>
                <div className="hidden md:flex space-x-4">
                    {/* <Link href="/occasions" className="text-white hover:text-gray-200">Occasions</Link> */}
                    <Link href="/profile" className="text-white hover:text-gray-200">Profile</Link>
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
            {isOpen && (
                <div className="md:hidden">
                    <Link href="/occasions" className="block px-4 py-2 text-white hover:text-gray-200">Occasions</Link>
                    <Link href="/profile" className="block px-4 py-2 text-white hover:text-gray-200">Profile</Link>
                </div>
            )}
        </nav>
    );
}
