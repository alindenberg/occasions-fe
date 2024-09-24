import "@/styles/globals.css"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from 'next/app'
import Navbar from "@/components/Navbar"

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center w-full border-2 border-green-400">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  )
}

export default MyApp