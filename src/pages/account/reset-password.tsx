import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const password = formData.get('password');
        const hash = router.query.hash as string;
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password, hash }),
            });
            if (!response.ok) {
                throw new Error('Failed to reset password');
            }
            toast.success('Password reset successfully!');
            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            setError('Failed to reset password. Please try again.');
        }
    }

    return (
        <div className="dark:text-black flex flex-grow flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center md:w-1/2 w-2/3 bg-gray-100 border-2 border-orange-400 text-center pb-4">
                <p className="text-2xl bold underline p-4">Password Reset</p>
                {isSuccess ? (
                    <>
                        <p className="text-lg pb-4">Your password has been successfully reset.</p>
                        <Link href="/login">
                            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold p-2 rounded">
                                Go to Login
                            </button>
                        </Link>
                    </>
                ) : (
                    <>
                        <p className="text-lg pb-4">Enter your new password below.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col p-2 w-full">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="New Password"
                                    className="p-2 border-2 border-orange-400 w-full mb-4"
                                    required
                                />
                                <input
                                    type="submit"
                                    value="Reset Password"
                                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold p-2 rounded cursor-pointer"
                                />
                            </div>
                        </form>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </>
                )}
            </div>
        </div>
    );
}