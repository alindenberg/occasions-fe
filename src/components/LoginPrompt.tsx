import { useRouter } from 'next/router'

export default function LoginPrompt() {
    const router = useRouter();

    return (
        <main
            className="flex flex-col items-center justify-center"
        >
            <div className="text-center w-full bg-gray-100 p-6 sm:w-1/2 md:w-1/3 border-2 border-orange-400">
                <h1>Looks like you're not logged in, let's fix that.</h1>
                <button
                    onClick={() => router.push('/login')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Login
                </button>
            </div>
        </main>
    )
}