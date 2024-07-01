import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import type { AppProps } from "next/app";

import { UserProvider } from "@/context/userContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </UserProvider>
  )
}