import { useSession } from "next-auth/react";
import { useCallback } from "react";

export function useAuthSession() {
    const { data: session, status, update } = useSession();

    const refreshSession = useCallback(async () => {
        await update();
    }, [update]);

    return {
        session,
        status,
        refreshSession,
    };
}