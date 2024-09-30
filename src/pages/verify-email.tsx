import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function VerifyEmailPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    console.log("session ", session)
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'success' | 'error' | 'resent' | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const verifyEmail = async (token: string) => {
        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            const data = await response.json();
            if (data.success) {
                setVerificationStatus('success');
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            } else {
                setVerificationStatus('error');
                setErrorMessage(data.error || 'Failed to verify email');
            }
        } catch (error) {
            setVerificationStatus('error');
            setErrorMessage('An unexpected error occurred');
        } finally {
            setIsVerifying(false);
        }
    }

    useEffect(() => {
        if (router.isReady) {
            const { token } = router.query;
            if (token && typeof token === 'string') {
                setIsVerifying(true);
                verifyEmail(token);
            } else {
                setVerificationStatus('error');
                setErrorMessage('Invalid verification token');
            }
        }
    }, [router, router.isReady]);

    const handleResendVerification = async () => {
        try {
            setErrorMessage(null);
            const response = await fetch('/api/auth/resend-verification', { method: 'POST' });
            const data = await response.json();
            if (response.ok) {
                setVerificationStatus('resent');
            } else {
                setVerificationStatus('error');
                setErrorMessage(data.message || 'Failed to resend verification email');
            }
        } catch (error) {
            setVerificationStatus('error');
            setErrorMessage('An unexpected error occurred');
        }
    };

    return (
        <div className="dark:text-black flex flex-col flex-grow items-center justify-center border-2 border-orange-400">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
                {isVerifying ? (
                    <p>Verifying your email...</p>
                ) : verificationStatus === 'success' ? (
                    <>
                        <p className="text-green-600">Email verified successfully!</p>
                        <p className="mt-2">Redirecting to homepage in 3 seconds...</p>
                    </>
                ) : verificationStatus === 'resent' ? (
                    <p className="text-green-600">Successfully sent verification email</p>
                ) : verificationStatus === 'error' ? (
                    <>
                        {session && session.user && session.user.is_email_verified ? (
                            <>
                                <p>User is already verified</p>
                                <button
                                    onClick={() => router.push('/')}
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold mt-2 py-2 px-4 rounded"
                                >
                                    Go to Homepage
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-red-600 mb-4">{errorMessage}</p>
                                <button
                                    onClick={handleResendVerification}
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
                                >
                                    Resend Verification Email
                                </button>
                            </>
                        )}
                    </>
                ) : null}
            </div>
        </div >
    );
}