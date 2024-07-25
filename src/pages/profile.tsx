import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserContext from '@/context/userContext';

export default function ProfilePage() {
    const router = useRouter();
    const context = useContext(UserContext);
    const user = context?.user;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePasswordReset = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/auth/password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user?.email }),
            });
            if (!response.ok) {
                throw new Error('Failed to send reset email');
            }
            toast.success('Password reset email sent successfully.');
        } catch (error) {
            toast.error('Failed to send reset email.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="dark:text-black flex flex-col flex-grow items-center justify-center">
            <div className="p-6 bg-gray-100 border-2 border-orange-400">
                <div className="pb-4">
                    <h1 className="text-3xl font-bold underline pb-4">Profile</h1>
                    <p className="text-lg pb-4">Welcome, User!</p>
                    {user && user?.email && <p className="text-lg">Email: {user.email}</p>}
                    {user && user?.credits != undefined && (
                        <div className="flex flex-row items-center justify-between py-4">
                            <p className="text-lg">Credits: <span className='font-bold'>{user?.credits || 0}</span></p>
                            <button
                                className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-2 rounded"
                                onClick={() => router.push('/credits')}>
                                Purchase more
                            </button>
                        </div>
                    )}
                </div>
                <hr className='border-gray-400 mb-2' />
                <div className="flex flex-row items-center justify-center py-2">
                    <button
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-2 rounded"
                        onClick={handlePasswordReset}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Sending...' : 'Reset Password'}
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}