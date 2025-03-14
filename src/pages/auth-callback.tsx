import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function AuthCallback() {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        // Only redirect when authentication status is known
        if (status === 'loading') return;

        // Get the destination from the URL or default to home
        const destination = router.query.destination
            ? decodeURIComponent(router.query.destination as string)
            : '/';

        // Clean redirect to the destination
        router.replace(destination);
    }, [router, status]);

    // Show a loading state while redirecting
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );
}