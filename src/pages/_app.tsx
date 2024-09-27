import "@/styles/globals.css"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import FeedbackWidget from '@/components/FeedbackWidget'
import Navbar from "@/components/Navbar"

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex w-full">
          <Component {...pageProps} />
          <FeedbackWidget />
        </main>
      </div>
    </SessionProvider>
  )
}

export default MyApp