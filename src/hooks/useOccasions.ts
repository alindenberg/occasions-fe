import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from './useAuthSession';
import { useEffect, useCallback } from 'react';
import { Occasion } from '@/types/occasions';

export function useOccasions() {
    const { session, status, refreshSession } = useAuthSession();
    const queryClient = useQueryClient();

    // This effect will run whenever the session changes (token refreshes)
    useEffect(() => {
        if (status === 'authenticated') {
            // Invalidate and refetch occasions data when session changes
            queryClient.invalidateQueries({ queryKey: ['occasions'] });
        }
    }, [session, status, queryClient]);

    // Handle errors from the query
    const handleError = useCallback(async (error: Error) => {
        console.error('Error fetching occasions:', error);
        // If the error is due to an expired token, try to refresh the session
        if (error.message.includes('Session expired')) {
            await refreshSession();
        }
    }, [refreshSession]);

    const {
        data: occasions,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['occasions'],
        queryFn: async () => {
            try {
                const response = await fetch('/api/occasions');

                if (!response.ok) {
                    // If we get a 401, try to refresh the session
                    if (response.status === 401) {
                        await refreshSession();
                        // The query will be automatically retried after session refresh
                        throw new Error('Session expired, refreshing...');
                    }
                    throw new Error('Failed to fetch occasions');
                }

                return response.json() as Promise<Occasion[]>;
            } catch (err) {
                const error = err as Error;
                await handleError(error);
                throw error;
            }
        },
        // Only run query when we have a session
        enabled: status === 'authenticated',
        // Retry failed requests
        retry: 2,
        // Refetch on window focus
        refetchOnWindowFocus: true,
        // Use previous data while fetching new data
        placeholderData: (prev) => prev,
        // Refetch every 5 minutes
        refetchInterval: 5 * 60 * 1000,
        // Don't refetch on mount if we already have data
        refetchOnMount: 'always'
    });

    return {
        occasions: occasions || [],
        isLoading,
        isError,
        error,
        refetch
    };
}