import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import type { AppProps } from "next/app";

import { getAuthServerSideProps } from "@/utils/auth";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={!!pageProps.user} />
      <Component {...pageProps} />
    </div>
  )
}
export const getServerSideProps = getAuthServerSideProps