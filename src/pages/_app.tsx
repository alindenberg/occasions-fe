import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Component {...pageProps} />
    </div>
  )
}
