import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';


export default function ResetPasswordPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [hash, setHash] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const password1 = formData.get('password1');
        const password2 = formData.get('password2');
        const hash = router.query.hash as string;
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password1, password2, hash }),
            });
            if (!response.ok) {
                throw new Error('Failed to reset password');
            }
            router.push('/login');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="dark:text-black flex flex-grow flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center md:w-1/2 w-2/3 bg-gray-100 border-2 border-orange-400">
                <p className="text-2xl bold underline p-4">Password Reset</p>
                <p className="text-lg pb-4">Enter your email address and we will send you a link to reset your password.</p>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col p-2 w-full">
                        <input
                            type="password"
                            name="password1"
                            placeholder="New Password"
                            className="p-2 border-2 border-orange-400 w-full mb-4"
                            required
                        />
                        <input
                            type="password"
                            name="password2"
                            placeholder="Confirm New Password"
                            className="p-2 border-2 border-orange-400 w-full mb-4"
                            required
                        />
                        <input
                            type="submit"
                            value="Reset Password"
                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold p-2 rounded"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}