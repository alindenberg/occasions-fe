import "@/styles/globals.css"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import FeedbackWidget from '@/components/FeedbackWidget'
import Head from 'next/head'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: true,
        staleTime: 30 * 1000, // 30 seconds
      },
    },
  }))

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>Occasion Alerts</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow flex w-full">
            <Component {...pageProps} />
            <FeedbackWidget />
            <Toaster
              position="bottom-center"
              toastOptions={{
                className: 'text-sm font-medium rounded-md p-4 shadow-lg',
                success: {
                  className: 'bg-green-500 text-white',
                },
                error: {
                  className: 'bg-red-500 text-white',
                },
              }}
            />
          </main>
        </div>
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default MyApp