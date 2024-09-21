import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Profile() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const loading = status === "loading"

    useEffect(() => {
        if (!loading && !session) {
            router.push('/login')
        }
    }, [session, loading, router])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!session) {
        return null
    }

    return (
        <div className="dark:text-black flex flex-col flex-grow items-center justify-center">
            <div className="p-6 bg-gray-100 border-2 border-orange-400">
                <div className="pb-4">
                    <h1 className="text-3xl font-bold underline pb-4">Profile</h1>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 text-sm font-bold mb-2">Name</p>
                    <p className="text-gray-700">{session.user?.name}</p>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 text-sm font-bold mb-2">Email</p>
                    <p className="text-gray-700">{session.user?.email}</p>
                </div>
                <div className="mb-4">
                    <p className="text-gray-700 text-sm font-bold mb-2">Credits</p>
                    <p className="text-gray-700">{session.user?.credits ?? 'N/A'}</p>
                </div>
                <button
                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => router.push('/credits')}
                >
                    Purchase More Credits
                </button>
            </div>
        </div>
    )
}