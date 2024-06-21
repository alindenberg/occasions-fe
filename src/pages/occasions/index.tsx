import { useState } from 'react';
import { useRouter } from 'next/router'
import { Occasion } from "@/types/occasions"
import { GetServerSideProps } from 'next'

import OccasionTile from '@/components/occasions/Tile'

export default function OccasionsPage({ occasions, isAuthenticated }: { occasions: Occasion[], isAuthenticated: boolean }) {
    const router = useRouter()


    const [occasionsList, setOccasionsList] = useState(occasions);

    async function deletionHandler(occasion_id: number) {
        const response = await fetch(`/api/occasions/${occasion_id}/delete`);
        if (!response.ok) {
            throw new Error('Failed to delete occasion');
        }
        const updatedOccasions = occasionsList.filter(occasion => occasion.id !== occasion_id);
        console.log("setting updated occasions ", updatedOccasions)
        setOccasionsList(updatedOccasions);
    }

    async function modifyHandler(occasion_id: number) {
        router.push(`/occasions/${occasion_id}/modify`);
    }
    if (!isAuthenticated) {
        return (
            <main
                className="flex min-h-screen flex-col items-center justify-center p-24"
            >
                <h1>Looks like you're not logged in, let's fix that.</h1>
                <button
                    onClick={() => router.push('/login')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Login
                </button>
            </main>
        )
    }

    return (
        <main
            className="flex min-h-screen flex-col items-center mt-4"
        >
            <h1 className="text-2xl bold underline py-4 bg-orange-300 p-4">Your upcoming occasions</h1>
            <div className="flex flex-grow w-full flex-col items-center justify-start">
                {!!occasionsList?.length && (
                    <div className="w-full sm:w-3/4 lg:w-1/3">
                        {occasionsList.map((occasion) => (
                            <div className="pt-4" key={occasion.id}>
                                <OccasionTile
                                    occasion={occasion}
                                    modifyHandler={modifyHandler}
                                    deletionHandler={deletionHandler}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {!occasionsList?.length && (
                    <div className="text-center">
                        <p>Well, that's bizarre.</p>
                        <p className="pt-2">You don't have any upcoming occasions.</p>
                        <p className="pt-2">Surely there's something to celebrate.</p>
                    </div>
                )}
                {occasionsList?.length < 3 && (
                    <button
                        onClick={() => router.push('/occasions/new')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Add an occasion
                    </button>
                )}
            </div>
        </main>
    )
}

// This gets called on every request
export const getServerSideProps: GetServerSideProps = async (context) => {
    // Fetch data from external API
    const authCookie = context.req.cookies.Authorization;
    if (!authCookie) {
        return { props: { occasions: [], isAuthenticated: false } }
    }

    const res = await fetch('http://localhost:3000/api/occasions/', {
        headers: {
            'Authorization': authCookie
        }
    });
    if (res.status === 401) {
        return { props: { occasions: [], isAuthenticated: false } }
    }
    const occasions = await res.json()

    // Pass data to the page via props
    return { props: { occasions, isAuthenticated: true } }
}