import { useSession } from "next-auth/react";
import { useCallback, useState, useEffect } from "react";

export function useAuthSession() {
    const { data: session, status, update } = useSession();
    const [loading, setLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        await update();
    }, [update]);

    useEffect(() => {
        if (status === 'loading') {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [status]);

    return {
        session: session || null,
        loading,
        status,
        refreshSession,
    };
}