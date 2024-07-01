import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import type { AppProps } from "next/app";

import { UserProvider } from "@/context/userContext";
import { getAuthServerSideProps } from "@/utils/auth";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider value={pageProps.user}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Component {...pageProps} />
      </div>
    </UserProvider>
  )
}
export const getServerSideProps = getAuthServerSideProps