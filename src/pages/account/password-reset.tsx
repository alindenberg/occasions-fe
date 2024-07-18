import Link from 'next/link';
import { useState } from 'react';

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
        <div className="dark:text-black flex flex-grow flex-col items-center justify-center">
            {resetSent ? (
                <div className="flex flex-col items-center justify-center md:w-1/2 w-2/3 bg-gray-100 border-2 border-orange-400 p-4">
                    <p className="text-lg">Check your email for a link to reset your password.</p>
                    <Link href="/login" className="text-orange-500 hover:underline mt-4">Back to Login</Link>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center md:w-1/2 w-2/3 bg-gray-100 border-2 border-orange-400">
                    <p className="text-2xl bold underline p-4">Password Reset</p>
                    <p className="text-lg pb-4">Enter your email address and we will send you a link to reset your password.</p>
                    <form onSubmit={handleSubmit} className="w-full">
                        <div className="flex flex-col md:flex-row p-2 justify-center items-center md:justify-evenly">
                            <div className="p-2 w-2/3 xs:w-full">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-2 border-2 border-orange-400 w-full"
                                    required
                                />
                            </div>
                            <div className="p-2 w-1/3 xs:w-full flex items-center justify-center">
                                <input
                                    type="submit"
                                    value={isSubmitting ? 'Sending...' : 'Send Reset Email'}
                                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold p-2 rounded"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        <div className="flex flex-grow items-center justify-center">
                            {error && <p className="text-red-500 p-2">{error}</p>}
                        </div>
                    </form>
                </div>
            )
            }
        </div >
    );
}