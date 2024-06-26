import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            router.push('/');
        } else {
            const errorData = await response.json();
            setError(errorData.error);
        }
    }

    return (
        <div className="vertical-padding flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-500 transition duration-300"
                        >
                            Sign Up
                        </button>
                    </div>
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-orange-500 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
