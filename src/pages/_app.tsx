import "@/styles/globals.css"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import FeedbackWidget from '@/components/FeedbackWidget'
import Head from 'next/head'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Occasion Alerts</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
    </SessionProvider>
  )
}

export default MyApp