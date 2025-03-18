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
          <meta name="description" content="Create and track important occasions (birthdays, anniversaries, graduations, etc.) Receive timely reminders for upcoming events via AI-generated messages tailored to each occasion. Save time and show you care with personalized greetings." />

          {/* Standard favicon */}
          <link rel="icon" href="/favicon.ico" />

          {/* Google Search Console Verification - add your verification code here */}
          <meta name="google-site-verification" content="40h-D0jjdNS54zeCUIDZCjrQtg6-y4dWXY-iaHNEBNw" />

          {/* Web Manifest */}
          <link rel="manifest" href="/manifest.json" />

          {/* Theme and Colors */}
          <meta name="theme-color" content="#F97316" />
          <meta name="msapplication-TileColor" content="#F97316" />

          {/* Open Graph */}
          <meta property="og:title" content="Occasion Alerts" />
          <meta property="og:description" content="Create and track important occasions (birthdays, anniversaries, graduations, etc.) Receive timely reminders for upcoming events via AI-generated messages tailored to each occasion. Save time and show you care with personalized greetings." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://occasionalerts.com" />
          <meta property="og:image" content="https://occasionalerts.com/og-image.png" />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Occasion Alerts" />
          <meta name="twitter:description" content="Create and track important occasions (birthdays, anniversaries, graduations, etc.) Receive timely reminders for upcoming events via AI-generated messages tailored to each occasion. Save time and show you care with personalized greetings." />
          <meta name="twitter:image" content="https://occasionalerts.com/twitter-image.png" />
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