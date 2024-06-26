import { useContext } from 'react';

import UserContext from '@/context/userContext';

export default function ProfilePage() {
    const context = useContext(UserContext);
    const user = context?.user;

    return (
        <div className="flex flex-grow items-center justify-center">
            <div className="p-10 bg-gray-100 border-2 border-orange-400">
                <div className="text-3xl font-bold pb-4">Profile</div>
                <div className="text-lg pb-4">Welcome, User!</div>
                {user && user?.email && <div className="text-lg">Email: {user.email}</div>}
            </div>
        </div>
    )
}