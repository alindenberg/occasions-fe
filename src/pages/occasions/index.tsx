import { useRouter } from 'next/router'
import { Occasion } from "@/types/occasions"
import { GetServerSideProps } from 'next'

import OccasionTile from '@/components/occasions/Tile'

export default function OccasionsPage({ occasions, isAuthenticated }: { occasions: Occasion[], isAuthenticated: boolean }) {
    const router = useRouter()

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
            className="flex min-h-screen flex-col items-center p-24"
        >
            <h1>Your upcoming occasions</h1>
            <div className="flex flex-grow flex-col justify-center border-2 border-red-500">
                {!!occasions?.length && (
                    <div>
                        {occasions.map((occasion) => (
                            <OccasionTile key={occasion.id} occasion={occasion} />

                        ))}
                    </div>
                )}
                {!occasions?.length && (
                    <div className="text-center">
                        <p>Well that's bizarre, you don't have any upcoming occasions.</p>
                        <p>Let's fix that...</p>
                    </div>
                )}
                {occasions?.length < 3 && (
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
    const authCookie = context.req.cookies['Authorization'];
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