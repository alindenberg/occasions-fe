import Image from 'next/image';
import { useRouter } from 'next/router';

import { useContext } from 'react';
import UserContext from '@/context/userContext';

export default function HowItWorksPage() {
    const router = useRouter();
    const userCtx = useContext(UserContext);
    const user = userCtx?.user;

    return (
        <div className="dark:text-black flex flex-grow items-center justify-center">
            <div className="m-2 p-10 bg-gray-100 border-2 border-orange-400">
                <div className="text-center">
                    <div className="text-3xl font-bold pb-4">Welcome to Occasion Alerts!</div>
                    <div className="text-xl underline">Here&apos;s how it works:</div>
                </div>
                <div className="pt-2 text-lg">
                    <ul className="list-decimal list-inside">
                        <li>Create an occasion object for an upcoming occasion.
                            <ul className="list-disc list-inside pl-5">
                                <li>Provide a label for the occasion.</li>
                                <li>Provide a type for the occasion.</li>
                                <li>Provide a date for the occasion.</li>
                                <li>Provide additional details for context.</li>
                            </ul>
                        </li>
                        <li>Receive an email with a pre-generated message for the occasion at the specified time.</li>
                    </ul>
                </div>
                <div className="flex flex-grow justify-center">
                    {!!user ? (
                        <button
                            className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => router.push('/')}
                        >
                            View My Occasions
                        </button>
                    ) : (
                        <button
                            className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => router.push('/login')}
                        >
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </div >
    )
}
