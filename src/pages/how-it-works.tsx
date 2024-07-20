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
            <div className="m-2 p-10 bg-gray-100 border-2 border-orange-400 text-center">
                <div className="text-3xl font-bold pb-4">Welcome to Occasion Alerts!</div>
                <div className="text-xl underline">Here&apos;s how it works:</div>
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
                        <li>Receive an email with a pre-generated message for the occasion.</li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center mt-8">
                    <div className="relative">
                        <Image src="/occasions/OccasionSetup.png" alt="Step 1: Create the Occasion" width={400} height={400} />
                        <div className="hidden sm:block absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2">
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="relative mt-4 sm:mt-0 sm:ml-4">
                        <Image src="/occasions/CreatedOccasion.png" alt="Step 2: Wait for the Occasion" width={400} height={400} />
                        <div className="hidden sm:block absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2">
                            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-4">
                        <Image src="/occasions/OccasionEmail.png" alt="Step 3: Receive the email on the Occasion's date" width={400} height={400} />
                    </div>
                </div>

                <div className="flex flex-grow justify-center">
                    {!!user ? (
                        <button
                            className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => router.push('/occasions')}
                        >
                            View My Occasions
                        </button>
                    ) : (
                        <button
                            className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => router.push('/login?redirect=/occasions')}
                        >
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </div >
    )
}
