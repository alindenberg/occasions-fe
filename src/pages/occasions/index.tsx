import { useRouter } from 'next/router'
import { Occasion } from "@/types/occasions"
import { GetServerSideProps } from 'next'

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
            {occasions?.length && (
                <div className="flex flex-grow flex-col justify-center">
                    {occasions.map((occasion) => (
                        <div key={occasion.id} className='border-2 border-red-500'>
                            <h2>{occasion.type}</h2>
                            <p>{occasion.date}</p>
                        </div>
                    ))}
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