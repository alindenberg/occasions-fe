import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import Detail from '../components/Detail'

export default function HowItWorks() {
    const { data: session } = useSession()
    const isAuthenticated = !!session
    const router = useRouter()

    return (
        <div className="dark:text-black flex flex-grow items-center justify-center">
            <div className="flex flex-col items-center">
                <Detail />
                <div className="mt-6">
                    {isAuthenticated ? (
                        <button
                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => router.push('/')}
                        >
                            View My Occasions
                        </button>
                    ) : (
                        <button
                            className="w-48 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition duration-200 ease-in-out hover:scale-105 text-lg"
                            onClick={() => router.push('/login')}
                        >
                            Log In
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
