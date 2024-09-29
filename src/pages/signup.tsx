import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
            const redirectUrl = router.query.redirect ? String(router.query.redirect) : '/';
            router.push(redirectUrl);
        }
    }, [status, router]);

    const handleGoogleSignup = async () => {
        await signIn('google', { callbackUrl: router.query.redirect ? String(router.query.redirect) : '/' });
    };

    const handleCredentialsSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
                isSignUp: true,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                const redirectUrl = router.query.redirect ? String(router.query.redirect) : '/';
                router.push(redirectUrl);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setError('An unexpected error occurred');
        }
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border-2 border-orange-400">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Sign Up</h2>
                <form onSubmit={handleCredentialsSignup} className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 mb-3 border rounded-md"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 mb-3 border rounded-md"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 mb-3 border rounded-md"
                        required
                    />
                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="relative mb-4">
                    <hr className="border-t border-gray-300" />
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-500 text-sm">
                        OR
                    </span>
                </div>
                <button
                    onClick={handleGoogleSignup}
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                        />
                    </svg>
                    Sign Up with Google
                </button>
                <div className="mt-4 text-sm text-center text-gray-600">
                    By signing up, you agree to our <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                </div>
                <div className="mt-4 text-sm text-center text-gray-600">
                    Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
}