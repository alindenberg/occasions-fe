import { useContext } from 'react';
import { useRouter } from 'next/router';

import UserContext from '@/context/userContext';

export default function ProfilePage() {
    const router = useRouter();
    const context = useContext(UserContext);
    const user = context?.user;

    return (
        <div className="dark:text-black flex flex-col flex-grow items-center justify-center">
            <div className="p-6 bg-gray-100 border-2 border-orange-400">
                <div className="pb-4">
                    <h1 className="text-3xl font-bold underline pb-4">Profile</h1>
                    <p className="text-lg pb-4">Welcome, User!</p>
                    {user && user?.email && <p className="text-lg">Email: {user.email}</p>}
                    {user && user?.credits && (
                        <div className="flex flex-row items-center justify-between py-4">
                            <p className="text-lg">Credits: {user?.credits || 10}</p>
                            <button
                                className="bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-2 rounded"
                                onClick={() => router.push('/credits')}>
                                Purchase more
                            </button>
                        </div>
                    )}
                </div>
                <hr className='border-gray-400 mb-4' />
            </div>
        </div>
    )
}