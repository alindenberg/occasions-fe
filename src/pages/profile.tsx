import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Profile() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const loading = status === "loading"
    const [credits, setCredits] = useState<number | null>(null)

    useEffect(() => {
        if (!loading && !session) {
            router.push('/login')
        } else if (session) {
            fetchUserData()
        }
    }, [session, loading, router])

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/users/me')
            if (response.ok) {
                const data = await response.json()
                setCredits(data.credits)
            } else {
                console.error('Failed to fetch user data')
            }
        } catch (error) {
            console.error('Error fetching user data:', error)
        }
    }

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
                    <p className="text-gray-700">{credits !== null ? credits : 'Loading...'}</p>
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